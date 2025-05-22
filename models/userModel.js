const mongoose = require ('mongoose')

const userSchema = mongoose.Schema({
    name: String,
    password: String,
    email: String,
    bookeds: [{movie:{type:mongoose.Schema.Types.ObjectId,ref:'movie'},time: String,ticket: Number}]
}) 

module.exports = mongoose.model('user', userSchema)