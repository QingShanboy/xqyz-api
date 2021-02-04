const mongoose = require('../config/db')
const { Schema, model }  = mongoose

const channelsSchema = new Schema({
    __v: {type: Number, select: false },
    name: {type: String, required: true},
    following: {
        type: [ {type: Schema.Types.ObjectId, ref: 'User'}],
        select: false
    },
    articles: {
        type: [ {type: Schema.Types.ObjectId, ref: 'Artic'}],
        select: false
    }
})
module.exports = model('Channels', channelsSchema)