const mongoose = require('mongoose');

const { Schema, model } = mongoose;
const commentSchema = new Schema({
  __v: { type: Number, select: false },
  // 评论的内容
  content: { type: String, required: true },
  //评论人
  commentator: { type: Schema.Types.ObjectId, ref: 'User', required: true, select: false },
  questionId: { type: String },
  answerId: { type: String},
  articleId: { type: String, required: true },
  rootCommentId: { type: String },
  replyTo: { type: Schema.Types.ObjectId, ref: 'User' },
  // 评论的评论
  second_comment: {
    type: [{
      content: { type: String },
      commentator: { type: Schema.Types.ObjectId, ref: 'user' },
      rootCommentId: { type: String }, 
      questionId: { type: String },
      answerId: { type: String},
      articleId: { type: String, required: true },
      replyTo: { type: Schema.Types.ObjectId, ref: 'user' },
      is_zan: {type: Number, enum: [0, 1]},
      createdAt: { type: Date },
      zan_number: { type: Number, default: 0 },
      replyCount:{type: Number}
    }]
  },
  // 点赞量
  zan_number:{ type: Number,default: 0},
  is_zan: {type: Number, enum: [0, 1]},
  replyCount:{type: Number}
}, { timestamps: true });

module.exports = model('Comment', commentSchema);