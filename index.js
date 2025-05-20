//added commit
const express = require ('express')
const app = express()
const bcrypt = require ('bcrypt')
const jwt = require ('jsonwebtoken')
require('dotenv').config()
const cookieParser = require('cookie-parser')

const userModel = require ('./models/userModel')
const adminModel = require ('./models/adminModel')
const movieModel = require ('./models/movieModel')

app.use(cookieParser());
app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.post ('/register', async(req,res)=>{
    let {name,email,password} = req.body
    if ( await userModel.findOne({email})) {return res.send('User already existing')} 

    try{
        let hash_pw = await bcrypt.hash(password,10)
        await userModel.create({
            name,email,password:hash_pw
        })
        res.send('User successfully created')
    }catch(err){
        console.error(err)
        res.send('User not created. Error tackled')
    }

})

app.post ('/login', async (req,res)=>{
    let {email,password} = req.body
    let user = await userModel.findOne({email})
    if(!user) {return res.send('No user with such email')}


    bcrypt.compare(password, user.password, (err,result)=>{
        if (result) {
            let token = jwt.sign({email:email, userid: user._id}, process.env.JWT_USER_KEY)
            res.cookie('token',token,{httpOnly: true, maxAge:3600000, secure:false,sameSite: 'strict'}).json('User logged in successfully')
        }
        else {res.send('Incorrect credentials')}
    })
})

app.get ('/user', isLoggedin, async(req,res)=>{
    console.log(req.user)
    let user = await userModel.findOne({email:req.user.email})

    res.send(`Welcome ${user.name}`)
})

app.get ('/logout', isLoggedin, (req,res)=>{
    res.clearCookie('token', { httpOnly: true, secure: false }).json('User logged out successfully')
})

function isLoggedin(req,res,next){
    const token = req.cookies.token
    if (!token) return res.status(401).send('Token where ?')
    try{
        const user = jwt.verify(token, process.env.JWT_USER_KEY)
        req.user = user
        next()
   } catch (err){
    res.status(403).send('Invalid token')
   }
}

function isAdmin (req,res,next){
    const token = req.cookies.token
    if (!token) return res.status(401).send('No token')
    try{   
        const admin = jwt.verify(token, process.env.JWT_ADMIN_KEY)
        req.admin = admin
        next()
    }
    catch(err){
        res.status(403).send('Unauthorized access not allowed')
    }
}

app.post ('/createAdmin', async (req,res)=>{
    let admin = await adminModel.find()
    if (admin.length>0) {return res.status(401).send('Only one admin privilige')}
    let {name,email,password} = req.body

    try{
        let hash_pw = await bcrypt.hash(password,10)
        await adminModel.create({
            name,email,password:hash_pw
        })
        res.send('Admin successfully created')
    }catch(err){
        console.error(err)
        res.send('Admin not created. Error tackled')
    }

})

app.post ('/loginAdmin', async (req,res)=>{
    let {email,password} = req.body
    let admin = await adminModel.findOne({email})
    if(!admin) {return res.json('You are not allowed admin priviliges')}


    bcrypt.compare(password, admin.password, (err,result)=>{
        if (result) {
            let token = jwt.sign({email:email, adminid: admin._id}, process.env.JWT_ADMIN_KEY)
            res.cookie('token',token,{httpOnly: true, maxAge:3600000, secure:false,sameSite: 'strict'}).json('Admin logged in successfully')
        }
        else {res.json('Incorrect credentials')}
    })
})

app.get ('/logoutAdmin', isAdmin, (req,res)=>{
    res.clearCookie('token', { httpOnly: true, secure: false }).json('Admin logged out successfully')
})

app.post('/moviecreate', isAdmin, async (req,res)=>{
    let {name,seats,runtime,showtime} = req.body
    try{
        await movieModel.create({name,seats,runtime,showtime})
        res.send('Movie added successfully')
    }catch(error)
    {
        console.error(err)
        res.status(403).send('Unable to add the movie')
    }
})

app.get ('/allmovies', isLoggedin, async(req,res)=>{
    let movies = await movieModel.find()
    res.send(movies)
})

app.get('/yourreservations', isLoggedin, async(req,res)=>{
    let user = await userModel.findOne({_id:req.user.userid}).populate("bookeds.movie")
    if (!user || user.bookeds.length === 0) {
        return res.send('You have no bookings.');
    }
    const reservations = user.bookeds.map((booked, i) => {
        return `You have ${booked.ticket} ticket${booked.ticket > 1 ? "s" : ""} for ${booked.movie.name} at ${booked.time}`;
    });

    res.send(reservations.join('\n'))
})

app.patch('/updateticket', isLoggedin, async (req, res) => {
    let user = await userModel.findOne({ _id: req.user.userid }).populate("bookeds.movie");
    if (user.bookeds.length === 0) {
        return res.send('You have no reservations to update');
    }

    let { name, time, seat, action } = req.body;
    let found = false;

    try {
        for (let i = 0; i < user.bookeds.length; i++) {
            let booked = user.bookeds[i];
            if (booked.movie.name === name && booked.time === time) {
                found = true;

                // Find matching showtime
                let show = booked.movie.showtime.find(s => s.time === time);

                if (!show) return res.status(404).send("Showtime not found");

                if (action === "add") {
                    booked.ticket += seat;
                    show.seats -= seat;
                    await booked.movie.save();
                    await user.save();
                    return res.send('Tickets added successfully');
                } else if (action === "subtract") {
                    booked.ticket -= seat;
                    show.seats += seat;
                    await booked.movie.save();
                    await user.save();
                    return res.send('Tickets reduced successfully');
                } else {
                    // remove booking
                    user.bookeds.splice(i, 1);
                    show.bookedby = show.bookedby.filter(uid => uid.toString() !== user._id.toString());
                    await booked.movie.save();
                    await user.save();
                    return res.send('Reservation cancelled');
                }
            }
        }

        if (!found) {
            return res.status(404).send("Matching reservation not found");
        }
    } catch (err) {
        console.error(err);
        res.status(401).send("Error processing the update information. Make sure you have the tickets to update and timing is correct.");
    }
});



app.post ('/reserveticket', isLoggedin, async (req,res)=>{
    let {name,timex,seat} = req.body
    let user = await userModel.findOne({_id:req.user.userid})

    index=-1
    let movie = await movieModel.findOne({name})
    
    movie.showtime.forEach((show, i) => {
    if (show.time === timex) {
        index = i;
    }
    })

    if (index == -1){return res.status(403).send('No such time for the film')}
    user.bookeds.push({
        movie: movie._id,
        time: timex,
        ticket: seat
    })
    await user.save()

    movie.showtime[index].seats-=seat
    movie.showtime[index].bookedby.push(user._id) 
    await movie.save()

    res.send(`${seat} ticket${seat>1 ?  "s" :""} reserved successfuly at ${timex} for the film ${name}`)
})


app.listen('3000')