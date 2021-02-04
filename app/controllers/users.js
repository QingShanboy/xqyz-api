const jsonwebtoken = require('jsonwebtoken')
const User = require('../models/users')
const Channels = require('../models/channels')
const Question = require('../models/questions')
const Answer = require('../models/answers')
const Artic  = require('../models/artic.js')
const config = require('../config/index')
const { checkCode } = require('../component/utils')

class UsersControllers{
    async getUser(ctx) {
        ctx.body = await User.find()
    }
    async getUserProfile(ctx) {
        console.log(1)
        const { fields = '' } = ctx.query
        const selectFileds = fields.split(';').filter(f => f).map(f => ' +' +  f ).join(' ')
        const user = await User.findById(ctx.params.id).select(selectFileds)
        if(!user) {ctx.throw(404, '用户不存在')}
        ctx.body = user
        // const { fields = '' } = ctx.query
        // const selectFields = fields.split(';').filter(f => f).map(f => ' +' + f).join('')
        // const user = await User.findById(ctx.params.id).select(selectFields)
        // if (!user) { ctx.throw(404, '用户不存在'); }
        // console.log(user)
        // ctx.body = user;
    }
    async chexkOwner(ctx,next) {
        if(ctx.params.id !== ctx.state.user._id) {
            ctx.throw(403, '权限不足')
        }
        await next()
    }
    async createUser(ctx) {
        ctx.verifyParams({
            name: { type:'string', required: true },
            password: { type:'string', required: true }
        })
        const { name } = ctx.request.body
        const  testUser = await User.findOne({ name })
        if(testUser) { ctx.throw(409, ('该用户已存在')) }
        const user  = await new User(ctx.request.body).save()
        ctx.body = user
    }
    
    async updateUser(ctx) {
        ctx.verifyParams({
            name: {type:'string', required: false },
            password: { type:'string', required: false },
            headPhoto: {type: 'string', required: false},
            gender:{type: 'number', required:false },
            signature:{type: 'string',required:false},
            birthday: {type: 'string', required:false},
            add: {type: 'string', required:false}
        })
        const { name } = ctx.request.body
        if(name) {
            const  ceckUser = await User.findOne({ name })
            if(ceckUser) {
                return ctx.body = { 
                    code: 400,
                    msg:'该昵称已经被人使用，请重新为自己想一个好听的昵称' 
                }
            } 
        }
        const user  = await User.findByIdAndUpdate(ctx.params.id,ctx.request.body)
        if(!user) {ctx.throw(404, '用户不存在')}
        ctx.body = {
            code: 200,
            msg:"更新成功"

        }
    }
    async deleteUser(ctx) {
        const user = await User.findByIdAndRemove(ctx.params.id)
        if(!user) {ctx.throw(404, '用户不存在')}
        ctx.status = 204;
    }
    //密码登录
    async login(ctx) {
        //接收用户数据 
        const { body } = ctx.request
        let sid = body.sid
        let code = body.code
        console.log(ctx.request.body)
        const codeRes = await checkCode(sid,code)
        if(codeRes) {
            const checkUser = {
                name: body.name,
                password: body.password
            }
            console.log('2')
            ctx.verifyParams({
                name: { type:'string', required: true },
                password: { type:'string', required: true }
            })
            const user = await User.findOne(checkUser)
            if(!user) {
                return ctx.body = { 
                    code: 400,
                    msg:'用户名或密码不正确，请重新输入' 
                }
            }
            const  { _id, name} = user
            const token = jsonwebtoken.sign({_id, name}, config.secret, {expiresIn: '1d'})
            ctx.body = { 
                code: 200,
                token ,
                _id
            }
        } else {
            return ctx.body = { 
                code: 400,
                msg:'验证输入错误，请重新输入' 
            }
        }
        
    }
    //密码登录
    async regist(ctx) {
        // 注册用户数据校验
        ctx.verifyParams({
            name: { type:'string', required: true },
            password: { type:'string', required: true }
        })
        const { body } = ctx.request
        let sid = body.sid
        let code = body.code
        console.log(ctx.request.body)
        const codeRes = await checkCode(sid,code)
        if(codeRes) {
            const { name } = ctx.request.body
            const  ceckUser = await User.findOne({ name })
            if(ceckUser) {
                return ctx.body = { 
                    code: 400,
                    msg:'该昵称已经被人使用，请重新为自己想一个好听的昵称' 
                }
            }
            const user  = await new User(ctx.request.body).save()
            ctx.body = { 
                code: 200,
                msg:'注册成功，欢迎登录体验闲逸致乐' 
            }
        } else {
            return ctx.body = { 
                code: 400,
                msg:'验证输入错误，请重新输入' 
            }
        }
        
    }
    // 获取关注
    async getFollowing(ctx) {
        const user = await User.findById(ctx.params.id).select('+following').populate('following');
        if (!user) { ctx.throw(404, '用户不存在'); }
        ctx.body = user.following
    } 
    // 获取粉丝
  async getFollowers(ctx) {
    const users = await User.find({ following: ctx.params.id });
    ctx.body = users;
  }
    // 检测关注的用户是否存在
    async checkUserExist(ctx, next) {
        const user = await User.findById(ctx.params.id);
        if (!user) { ctx.throw(404, '用户不存在'); }
        await next();
      }  
      // 关注用户
    async follow(ctx) {
      const me = await User.findById(ctx.state.user._id).select('+following');
      console.log(2)
      // 检测是否关注，未关注才能关注
      if (!me.following.map(id => id.toString()).includes(ctx.params.id)) {
        me.following.push(ctx.params.id);
        me.save();
        ctx.body = {
            code: 200,
            message: '关注成功'
          }
      } else {
        ctx.body = {
            code: 400,
            message: '关注已存在'
          }
      }
    }
     // 取消关注
    async unfollow(ctx) {
      const me = await User.findById(ctx.state.user._id).select('+following');
      const index = me.following.map(id => id.toString()).indexOf(ctx.params.id);
      if (index > -1) {
        me.following.splice(index, 1);
        me.save();
        ctx.body = {
            code: 200,
            message: '取消成功'
          }
      } else {
        ctx.body = {
            code: 400,
            message: '已经取消'
          }
      }
    }
    // 添加我的频道
  async addUserChannels (ctx) {
    const user = await User.findById(ctx.state.user._id).select('+followingChannels')
    // 没有添加频道才能添加
    if (!user.followingChannels.map(item => item.toString()).includes(ctx.params.id)) {
      user.followingChannels.push(ctx.params.id)
      await user.save()
      await Channels.findByIdAndUpdate(ctx.params.id, { $inc: { collect_number: 1 } })
      ctx.body = {
        code: 200,
        message: '添加成功'
      }
    } else {
        ctx.body = {
            code: 400,
            message: '已在我的频道列表'
         }
    }
  }
  // 移除我的频道
  async unUserChannels (ctx) {
    const user = await User.findById(ctx.state.user._id).select('+followingChannels')
    const index = user.followingChannels.indexOf(ctx.params.id)
    if (index > -1) {
      user.followingChannels.splice(index, 1)
      user.save()
      await Channels.findByIdAndUpdate(ctx.params.id, { $inc: { collect_number: -1 } })
      ctx.body = {
          code: 200,
          message: '移除成功'
      }
    } else {
        ctx.body = {
            code: 400,
            message: '移除失败，该频道不存在'
        }
    }
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
   

  // 文章点赞
  async likeArticle (ctx) {
    const user = await User.findById(ctx.state.user._id).select('+likeArticles')
    if (!user.likeArticles.map(item => item.toString()).includes(ctx.params.id)) {
      user.likeArticles.push(ctx.params.id)
      await user.save()
      await Artic.findByIdAndUpdate(ctx.params.id, { $inc: { zan_number: 1 } })
    }
    ctx.body = {
      code: 200,
      message: '点赞成功'
    }
  }
  
  // 文章取消赞
  async unlikeArticle (ctx) {
    const user = await User.findById(ctx.state.user._id).select('+likeArticles')
    const index = user.likeArticles.indexOf(ctx.params.id)
    if (index > -1) {
      user.likeArticles.splice(index, 1)
      await user.save()
      await Artic.findByIdAndUpdate(ctx.params.id, { $inc: { zan_number: -1 } })
    }
    ctx.body = {
      code: 200,
      message: '取消点赞成功'
    }
  }
  
  // 文章收藏
  async collectArticle (ctx) {
    const user = await User.findById(ctx.state.user._id).select('+collectArticles')
    if (!user.collectArticles.map(item => item.toString()).includes(ctx.params.id)) {
      user.collectArticles.push(ctx.params.id)
      await user.save()
      await Artic.findByIdAndUpdate(ctx.params.id, { $inc: { collect_number: 1 } })
    }
    ctx.body = {
      code: 200,
      message: '收藏成功'
    }
  }
  
  // 文章取消收藏
  async cancelCollectArticle (ctx) {
    const user = await User.findById(ctx.state.user._id).select('+collectArticles')
    const index = user.collectArticles.indexOf(ctx.params.id)
    if (index > -1) {
      user.collectArticles.splice(index, 1)
      await user.save()
      await Artic.findByIdAndUpdate(ctx.params.id, { $inc: { collect_number: -1 } })
    }
    ctx.body = {
      code: 200,
      message: '取消收藏成功'
    }
  }
  
  // 根据用户id返回用户点赞过的所有文章
  async getLikeArticlesByUserId (ctx) {
    const user = await User.findById(ctx.params.id).select('+likeArticles').populate('likeArticles')
    ctx.body = {
      code: 200,
      data: user.likeArticles
    }
  }
  
  // 根据用户id返回用户收藏过的所有文章
  async getCollectArticlesByUserId (ctx) {
    const user = await User.findById(ctx.params.id).select('+collectArticles').populate('collectArticles')
    ctx.body = {
      code: 200,
      data: user.collectArticles,
    }
  }
  async listQuestions(ctx) {
    const questions = await Question.find({ questioner: ctx.params.id });
    ctx.body = questions;
  }
  async listLikingAnswers(ctx) {
    const user = await User.findById(ctx.params.id).select('+likingAnswers').populate('likingAnswers');
    if (!user) { ctx.throw(404, '用户不存在'); }
    ctx.body = user.likingAnswers;
  }
  async likeAnswer(ctx, next) {
    const me = await User.findById(ctx.state.user._id).select('+likingAnswers');
    if (!me.likingAnswers.map(id => id.toString()).includes(ctx.params.id)) {
      me.likingAnswers.push(ctx.params.id);
      me.save();
      await Answer.findByIdAndUpdate(ctx.params.id, { $inc: { voteCount: 1 } });
    }
    ctx.status = 204;
    await next();
  }
  async unlikeAnswer(ctx) {
    const me = await User.findById(ctx.state.user._id).select('+likingAnswers');
    const index = me.likingAnswers.map(id => id.toString()).indexOf(ctx.params.id);
    if (index > -1) {
      me.likingAnswers.splice(index, 1);
      me.save();
      await Answer.findByIdAndUpdate(ctx.params.id, { $inc: { voteCount: -1 } });
    }
    ctx.status = 204;
  }
  async listDislikingAnswers(ctx) {
    const user = await User.findById(ctx.params.id).select('+dislikingAnswers').populate('dislikingAnswers');
    if (!user) { ctx.throw(404, '用户不存在'); }
    ctx.body = user.dislikingAnswers;
  }
  async dislikeAnswer(ctx, next) {
    const me = await User.findById(ctx.state.user._id).select('+dislikingAnswers');
    if (!me.dislikingAnswers.map(id => id.toString()).includes(ctx.params.id)) {
      me.dislikingAnswers.push(ctx.params.id);
      me.save();
    }
    ctx.status = 204;
    await next();
  }
  async undislikeAnswer(ctx) {
    const me = await User.findById(ctx.state.user._id).select('+dislikingAnswers');
    const index = me.dislikingAnswers.map(id => id.toString()).indexOf(ctx.params.id);
    if (index > -1) {
      me.dislikingAnswers.splice(index, 1);
      me.save();
    }
    ctx.status = 204;
  }
  async listCollectingAnswers(ctx) {
    const user = await User.findById(ctx.params.id).select('+collectingAnswers').populate('collectingAnswers');
    if (!user) { ctx.throw(404, '用户不存在'); }
    ctx.body = user.collectingAnswers;
  }
  async collectAnswer(ctx, next) {
    const me = await User.findById(ctx.state.user._id).select('+collectingAnswers');
    if (!me.collectingAnswers.map(id => id.toString()).includes(ctx.params.id)) {
      me.collectingAnswers.push(ctx.params.id);
      me.save();
    }
    ctx.status = 204;
    await next();
  }
  async uncollectAnswer(ctx) {
    const me = await User.findById(ctx.state.user._id).select('+collectingAnswers');
    const index = me.collectingAnswers.map(id => id.toString()).indexOf(ctx.params.id);
    if (index > -1) {
      me.collectingAnswers.splice(index, 1);
      me.save();
    }
    ctx.status = 204;
  }
}

module.exports = new UsersControllers()