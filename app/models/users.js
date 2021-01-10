const mongoose = require('../config/db')
const { Schema, model }  = mongoose

const userSchema = new Schema({
    __v: {type: Number, select: false },
    name: {type: String, required: true},
    password: {type: String, required: true, select: false },
    gender:{ type: Number , enum: [0, 1], default: 0, required: true},
    headPhoto: {type: String},
    signature:{ type: String, default: '这个人很懒，什么都没留下......' },
    birthday: {type: String, default: '0000-00-00'},
    addr: { type: String, default: 'XX'}
})

module.exports = model('User', userSchema)