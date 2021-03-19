const mongoose = require('../config/db')
const { Schema, model }  = mongoose
const articSchema =  new Schema({
    __v: { type: String, select: false},
   publisher: { type: Schema.Types.ObjectId, ref: 'User'},
   title: { type: String,required: true },
   author: { type: String,required: true },
   content: { type: String,required: true},
    // 文章的简短介绍
   introduce: { type: String },
    // 文章配图
   image: {
     type: [
       {
        type: String,required: true
       }
     ]
   },
    // 文章的点赞量
    zan_number:{ type: Number,default: 0},
    aritc_number:{ type: Number,default: 0},
    updatedDate: {type: Date,select: false },
    // 文章的收藏量
    collect_number: {type: Number,default: 0,select: false },
    channels: {
      type: [{ type: Schema.Types.ObjectId, ref: 'Channels' }],
      select: false,
    },
    is_followed: {type: Number,required: true, enum: [0, 1]},
    is_zan: {type: Number,required: true, enum: [0, 1]},
    is_collect: {type: Number,required: true, enum: [0, 1]}
  }, { timestamps: true })

  module.exports = model('Artic', articSchema)