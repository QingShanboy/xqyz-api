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
}, { timestamps: true });

module.exports = model('Comment', commentSchema);