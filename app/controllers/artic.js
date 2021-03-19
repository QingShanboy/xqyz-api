const Channels = require('../models/channels')
const User = require('../models/users')
const artic = require('../models/artic.js')

class ArticleCtl {
  // 返回所有的文章
  async getArticles (ctx) {
    // 默认每页展示20页
    const { perpage = 20 } = ctx.query
    const perPage = Math.max(perpage * 1, 1)
    // 默认从第一页开始
    const page = Math.max(ctx.query.current_page * 1, 1)
    // 分组正则匹配
    const q = new RegExp(ctx.query.q)
    const articles = await artic.find({ $or: [{ title: q }, { author: q }, { introduce: q }] }).sort({ createdAt: 'desc' }).limit(perPage).skip((page - 1) * perPage)
    const allArticles = await artic.find({ $or: [{ title: q }, { author: q }, { introduce: q }] })
    ctx.body = {
      code:200,
      data: articles,
      total: allArticles.length
    }
  }
  
  // 根据文章的id返回指定的文章
  async getArticleById (ctx) {
    const { fields = '' } = ctx.query;
    const selectFields = fields.split(';').filter(f => f).map(f => ' +' + f).join('');
    const article = await artic.findById(ctx.params.id).select(selectFields).populate('publisher channels')
    const user = await User.findById(ctx.state.user._id).select('+following')
    const userLike= await User.findById(ctx.state.user._id).select('+likeArticles')
    const userCollect = await User.findById(ctx.state.user._id).select('+collectArticles')
    // 检测是否关注，未关注才能关注
    if (!user.following.map(id => id.toString()).includes(article.publisher._id)) {
      article.is_followed = 0
    } else {
      article.is_followed = 1
    }// 检测是否关注，未关注才能关注
    if (!userLike.following.map(id => id.toString()).includes(ctx.params.id)) {
      article.is_zan = 0
    } else {
      article.is_zan = 1
    }// 检测是否关注，未关注才能关注
    if (!userCollect.following.map(id => id.toString()).includes(ctx.params.id)) {
      article.is_collect = 0
    } else {
      article.is_collect = 1
    }
    ctx.body = {
      code:200,
      data: article
    }
  }
  // 根据文章的id返回指定的文章
  async listArticleById (ctx) {
    const article = await artic.findById(ctx.params.id).select('+content +collect_number +zan_number -introduce')
    ctx.body = {
      code:200,
      data: article
    }
  }
  // 检查文章是否存在
  async checkArticleExist (ctx, next) {
    const article = await artic.findById(ctx.params.id)
    if (!article) { ctx.throw(404, '此文章不存在') }
    await next()
  }
  
  // 检查是否拥有文章的操作权限
  async checkArticleOwner (ctx, next) {
    const article = await artic.findById(ctx.params.id).select('+publisher')
    if (article.publisher.toString() !== ctx.state.user._id) {
      ctx.throw(403, '没有权限')
    }
    await next()
  }
  
  // 添加文章
  async addArticle (ctx) {
    ctx.verifyParams({
      title: { type: 'string', required: true },
      author: { type: 'string', required: true },
      content: { type: 'string', required: true },
      image: { type: 'string', required: false }
    })
    // 根据标题检查是否是重复添加了
    const oleArticle = await artic.findOne({ title: ctx.request.body.title })
    if (oleArticle) { ctx.throw(404, '此文章已存在，请勿重复添加') }
    const article = new artic ({ publisher: ctx.state.user._id, ...ctx.request.body })
    await article.save()
    const channel = await Channels.findById(ctx.params.id).select('+articles')
    // 没有添加频道才能添加
    if (!channel.articles.map(item => item.toString()).includes(article._id)) {
      channel.articles.push(article._id)
      await channel.save()
      await artic.findByIdAndUpdate(article._id, { $inc: { collect_number: 1 } })
    }
    ctx.body = {
      code:200,
      message: '创建成功'
    }
  }
  
  // 编辑文章
  async editArticle (ctx) {
    const article = await artic.findByIdAndUpdate(ctx.params.id, { ...ctx.request.body }, { new: true })
    ctx.body = {
      code:200,
      data: article,
      message: '编辑成功'
    }
  }
  
  // 删除文章
  async deleteArticle (ctx) {
    const article = await artic.findByIdAndRemove(ctx.params.id)
    ctx.body = {
      code:200,
      message: '删除成功'
    }
  }
  
  async getHotArticle (ctx) {
    const articles = await artic.find().select('+zan_number +author +image +introduce +createdAt').sort({ zan_number: 'desc' })
    ctx.body = {
      code:200,
      data: articles.splice(0, 10)
    }
  }
}

module.exports = new ArticleCtl()
