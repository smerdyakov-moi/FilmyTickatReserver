const mongoose = require ('mongoose')

const movieSchema = mongoose.Schema({
    name: String,
    runtime: Number,
    showtime: 
    [
        {
        time: String,
        seats: Number,
        bookedby:[{
            type:mongoose.Schema.Types.ObjectId, 
            ref:'user'
        }]
        }
    ]
})

module.exports = mongoose.model('movie', movieSchema)