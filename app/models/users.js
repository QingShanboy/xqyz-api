const mongoose = require('../config/db')
const { Schema, model }  = mongoose

const userSchema = new Schema({
    __v: {type: Number, select: false },
    name: {type: String, required: true},
    password: {type: String, required: true, select: false },
    headPhoto: {type: String},
    gender:{ type: String , enum: ['male', 'female'], default: 'male', required: true},
    signature:{ type: String},
    birthday: {type: String},
    add: { type: String, select: false }
})

module.exports = model('User', userSchema)