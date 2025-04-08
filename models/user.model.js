const mongoose = require('mongoose')
const { Schema } = mongoose

const userSchema = new Schema({
    firstName: {type: String, require: true},
    lastName: {type: String, require: true},
    username: { type: String, require: true},
    password: {type: String, require: true},
    role: {type: String, require: true},
    isActive: {type: Boolean, require: true},
    accessToken: {type: String, require: true}
},{
    timestamps: true
})

module.exports = mongoose.model('users', userSchema)
