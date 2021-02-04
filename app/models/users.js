const mongoose = require('../config/db')
const { Schema, model }  = mongoose

const userSchema = new Schema({
    __v: {type: Number, select: false },
    name: {type: String, required: true},
    password: {type: String, required: true, select: false },
    gender:{ type: Number , enum: [0, 1], default: 0, required: true},
    headPhoto: {type: String, default: ''},
    signature:{ type: String, default: '这个人很懒，什么都没留下......'},
    birthday: {type: String, default: '0000-00-00'},
    addr: { type: String, default: 'XX'},
    following: {
        type: [ {type: Schema.Types.ObjectId, ref: 'User'}]
    },
    followingChannels: {
      type: [{ type: Schema.Types.ObjectId, ref: 'Channels'}],
      default:'60025a8b79f727434c159f8c',
      select: false
    },// 点赞的文章
    likeArticles: {
      type: [{ type: Schema.Types.ObjectId, ref: 'articl' }],
      select: false
    },
    // 收藏的文章
    collectArticles: {
      type: [{ type: Schema.Types.ObjectId, ref: 'articl' }],
      select: false
    },
    likingAnswers: {
      type: [{ type: Schema.Types.ObjectId, ref: 'Answer' }],
      select: false,
    },
    dislikingAnswers: {
      type: [{ type: Schema.Types.ObjectId, ref: 'Answer' }],
      select: false,
    },
    collectingAnswers: {
      type: [{ type: Schema.Types.ObjectId, ref: 'Answer' }],
      select: false,
    },
})

module.exports = model('User', userSchema)