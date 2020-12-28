const mongoose = require('../config/db')
const { Schema, model }  = mongoose

const userSchema = new Schema({
    __v: {type: Number, select: false },
    name: {type: String, required: true},
    password: {type: String, required: true, select: false },
    headPhoto: {type: String, required: true, select: false },
    gender:{type:String , enum:['male', 'female'],default:'', required:false},
    signature:{type:String , default:'', required:false},
    birthday: {type:String , default:'', required:false},
    add: {type:String , default:'', required:false}
})

module.exports = model('User', userSchema)