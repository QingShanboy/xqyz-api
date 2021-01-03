const mongoose = require('../config/db')
const { Schema, model }  = mongoose

const userSchema = new Schema({
    __v: {type: Number, select: false },
    name: {type: String, required: true},
    password: {type: String, required: true, select: false },
    gender:{ type: String , enum: ['male', 'female'], default: 'male', required: true},
    headPhoto: {type: String},
    signature:{ type: String, default: '这个人很懒，什么都没留下......' },
    birthday: {type: String},
    add: { type: String, select: false }
})

module.exports = model('User', userSchema)