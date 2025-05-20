const mongoose = require ('mongoose')

const adminSchema = mongoose.Schema({
    name: String,
    password: String,
    email: String
})

module.exports = mongoose.model('admin', adminSchema)