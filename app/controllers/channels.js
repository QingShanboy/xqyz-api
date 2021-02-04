const Channels = require('../models/channels')
const User = require('../models/users')
const Artic  = require('../models/artic.js')

class ChannelsCtl{
    async getChannels(ctx) {
        ctx.body = await Channels.find()
    }
    async getChannelsById(ctx) {
        const { fields = '' } = ctx.query
        const selectFileds = fields.split(';').filter(f => f).map(f => ' +' +  f ).join(' ')
        const channels = await Channels.findById(ctx.params.id).select(selectFileds)
        if(!channels) {ctx.throw(404, '用户不存在')}
        ctx.body = channels
        // const { fields = '' } = ctx.query
        // const selectFields = fields.split(';').filter(f => f).map(f => ' +' + f).join('')
        // const Channels = await Channels.findById(ctx.params.id).select(selectFields)
        // if (!Channels) { ctx.throw(404, '用户不存在'); }
        // console.log(Channels)
        // ctx.body = Channels;
    }
    async getDefaultChannels(ctx) {
      const { fields = '' } = ctx.query
      const selectFileds = fields.split(';').filter(f => f).map(f => ' +' +  f ).join(' ')
      const channels = await Channels.findById('60025a8b79f727434c159f8c').select(selectFileds)
      ctx.body = {
        code: 400,
        data: channels
      }
  }
    async chexkOwner(ctx,next) {
        if(ctx.params.id !== ctx.state.Channels._id) {
            ctx.throw(403, '权限不足')
        }
        await next()
    }
    async createChannels(ctx) {
        ctx.verifyParams({
            name: { type:'string', required: true }
            })
        const { name } = ctx.request.body
        if(name) {
            const  ceckChannels = await Channels.findOne({ name })
            if(ceckChannels) {
                return ctx.body = { 
                    code: 400,
                    msg:'频道已存在' 
                }
            } 
        }
        const channels = await new Channels(ctx.request.body).save();
        ctx.body = channels;
    }
    
    async updateChannels(ctx) {
        ctx.verifyParams({
            name: {type:'string', required: false }
        })
        const { name } = ctx.request.body
        if(name) {
            const  ceckChannels = await Channels.findOne({ name })
            if(ceckChannels) {
                return ctx.body = { 
                    code: 400,
                    msg:'频道已存在' 
                }
            } 
        }
        const channels  = await Channels.findByIdAndUpdate(ctx.params.id,ctx.request.body)
        if(!channels) {ctx.throw(404, '用户不存在')}
        ctx.body = {
            code: 200,
            msg:"更新成功"

        }
    }
    // 获取频道下的文章
    async getArticles(ctx) {
        // 默认每页展示10页
        const { perpage = 10 } = ctx.query
        const { current_page = 1 } = ctx.query
        const perPage = Math.max(perpage * 1, 1)
        // 默认从第一页开始
        const page = Math.max(current_page * 1, 1)
        const channels = await Channels.findById(ctx.params.id).select('+articles').populate('articles')
        const articleList = channels.articles.slice((page - 1) * perPage, page * perPage)
        console.log(perPage)
        console.log(page-1)
        console.log(channels.articles)
        ctx.body = {
            code:200,
            data: articleList,
            total: channels.articles.length,
            message: '数据获取成功'
          }
    } 
    // 获取粉丝
  async getFollowers(ctx) {
    const Channels = await Channels.find({ following: ctx.params.id });
    ctx.body = Channels;
  }
   // 获取用户频道
   async getUserChannels (ctx) {
    console.log(3)
    console.log(ctx.state.user._id)
    const user = await User.findById(ctx.state.user._id).select('+followingChannels').populate('followingChannels')
    console.log(user.followingChannels)
    ctx.body = {
      data: user.followingChannels,
      message: '数据获取成功'
    }
  }
    // 检测关注的用户是否存在
    async checkChannelsExist(ctx, next) {
        const Channels = await Channels.findById(ctx.params.id);
        if (!Channels) { ctx.throw(404, '用户不存在'); }
        await next();
      }  
      // 关注用户
      async follow(ctx) {
        const me = await Channels.findById(ctx.state.Channels._id).select('+following');
        // 检测是否关注，未关注才能关注
        if (!me.following.map(id => id.toString()).includes(ctx.params.id)) {
          me.following.push(ctx.params.id);
          me.save();
        }
        ctx.status = 204;
      }

       // 取消关注
      async unfollow(ctx) {
        const me = await Channels.findById(ctx.state.Channels._id).select('+following');
        const index = me.following.map(id => id.toString()).indexOf(ctx.params.id);
        if (index > -1) {
          me.following.splice(index, 1);
          me.save();
        }
        ctx.status = 204;
      }
}

module.exports = new ChannelsCtl()