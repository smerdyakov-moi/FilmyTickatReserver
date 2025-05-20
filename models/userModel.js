const mongoose = require ('mongoose')
mongoose.connect('mongodb://127.0.0.1:27017/ProjectDev')

const userSchema = mongoose.Schema({
    name: String,
    password: String,
    email: String,
    bookeds: [{movie:{type:mongoose.Schema.Types.ObjectId,ref:'movie'},time: String,ticket: Number}]
}) 

module.exports = mongoose.model('user', userSchema)