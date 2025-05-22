//added commit
const express = require ('express')
const cookieParser = require('cookie-parser')
require('dotenv').config()
const db = require ('./config/mongoose-connection')

const app = express ()

app.use(cookieParser());
app.use(express.json())
app.use(express.urlencoded({extended:true}))

const authRoutes = require('./routes/authroutes');
const movieRoutes = require('./routes/movieroutes')

app.use('/', authRoutes);
app.use('/', movieRoutes);

app.listen(3000, () => {
  console.log('Listening....');
});
