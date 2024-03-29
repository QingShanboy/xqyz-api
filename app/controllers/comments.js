const Comment = require('../models/comments');
const artic = require('../models/artic.js')

class CommentsCtl {
  async find(ctx) {
    const { per_page = 10 } = ctx.query
    const {type} = ctx.query
    const page = Math.max(ctx.query.page * 1, 1) - 1
    const perPage = Math.max(per_page * 1, 1)
    const q = new RegExp(ctx.query.q)
    const { articleId } = ctx.params
    const { rootCommentId } = ctx.query
    const comment = await Comment
      .find({ content: q,articleId, rootCommentId })
      .limit(perPage).skip(page * perPage)
      .populate('commentator second_comment replyTo')
    ctx.body ={
      code:200,
      data: comment,
      total: comment.length
    }
  }
  async checkCommentExist(ctx, next) {
    const comment = await Comment.findById(ctx.params.id).select('+commentator');
    if (!comment) { ctx.throw(404, '评论不存在'); }
    if (ctx.params.questionId && comment.questionId.toString() !== ctx.params.questionId) {
      ctx.throw(404, '该问题下没有此评论');
    }
    if (ctx.params.answerId && comment.answerId.toString() !== ctx.params.answerId) {
      ctx.throw(404, '该答案下没有此评论');
    }
    ctx.state.comment = comment;
    await next();
  }
  async findById(ctx) {
    const { fields = '' } = ctx.query;
    const selectFields = fields.split(';').filter(f => f).map(f => ' +' + f).join('');
    const comment = await Comment.findById(ctx.params.id).select(selectFields).populate('commentator');
    ctx.body ={
      code:200,
      data: comment,
      total: comment.length
    }
  }
  async create(ctx) {
    ctx.verifyParams({
      content: { type: 'string', required: true },
      rootCommentId: { type: 'string', required: false },
      replyTo: { type: 'string', required: false },
    })
    const commentator = ctx.state.user._id
    const { articleId } = ctx.params
    const { body } = ctx.request
    const { rootCommentId, replyTo, content } = ctx.request.body
    if(rootCommentId && replyTo) {
      const comment = await Comment.findById(rootCommentId)
      comment.second_comment.unshift({ ...body, articleId, createdAt: new Date(), commentator })
      comment.save()
      // 文章的评论数量递增
      await artic.findByIdAndUpdate(articleId, { $inc: { aritc_number: 1 } })

    } else {
      const comment = await new Comment({ ...body, commentator, articleId }).save()
      // 文章的评论数量递增
      await artic.findByIdAndUpdate(articleId, { $inc: { aritc_number: 1 } })
    }
    ctx.body = {
      code:200,
      message: '评论成功'
    }
  }
  async checkCommentator(ctx, next) {
    const { comment } = ctx.state;
    if (comment.commentator.toString() !== ctx.state.user._id) { ctx.throw(403, '没有权限'); }
    await next();
  }
  async update(ctx) {
    ctx.verifyParams({
      content: { type: 'string', required: false },
    });
    const { content } = ctx.request.body;
    await ctx.state.comment.update({ content });
    ctx.body = ctx.state.comment;
  }
  async delete(ctx) {
    await Comment.findByIdAndRemove(ctx.params.id);
    ctx.status = 204;
  }
}

module.exports = new CommentsCtl();