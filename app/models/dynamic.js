
const mongoose = require('mongoose');

const { Schema, model } = mongoose;
const dynamicSchema = new Schema({
  __v: {
    type: Number,
    select: false
  },
  // 动态的内容
  content: {
    type: String
  },
  // 该动态发布者的头像
  avatar_url: {
    type: [{
      type: String
    }]
  },
  // 是否是私密的
  is_private: {
    type: Boolean,
    default: false
  },
  // 动态的发布者
  publisher: {
    type: Schema.Types.ObjectId,
    ref: 'user'
  },
  // 动态的点赞量
  zan_number: {
    type: Number,
    default: 0
  },
  // 动态的收藏量
  collect_number: {
    type: Number,
    default: 0
  },
  // 动态的评论量
  comment_number: {
    type: Number,
    default: 0
  }
}, { timestamps: true }) // timestamps: truemongoose自带的时间戳

const dynamicModel = model('dynamic', dynamicSchema)

module.exports = dynamicModel