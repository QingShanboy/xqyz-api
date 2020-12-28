const jsonwebtoken = require('jsonwebtoken')
const User = require('../models/users')
const config = require('../config/index')


class UsersControllers{
    async getUser(ctx) {
        ctx.body = await User.find()
    }
    async getUserId(ctx) {
        const user = await User.findById(ctx.params.id)
        if(!user) {ctx.throw(404, '用户不存在')}
        ctx.body = user
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
            headPhoto: {type: 'string', required: false, select: false },
            gender:{type: 'string', required:false },
            signature:{type: 'string',required:false},
            birthday: {type: 'string', required:false},
            add: {type: 'string', required:false}
        })
        const user  = await User.findByIdAndUpdate(ctx.params.id,ctx.request.body)
        if(!user) {ctx.throw(404, '用户不存在')}
        ctx.body = user
    }
    async deleteUser(ctx) {
        const user = await User.findByIdAndRemove(ctx.params.id)
        if(!user) {ctx.throw(404, '用户不存在')}
        ctx.status = 204;
    }
    async login(ctx) {
        ctx.verifyParams({
            name: { type:'string', required: true },
            password: { type:'string', required: true }
        })
        const user = await User.findOne(ctx.request.body)
        if(!user) {
            ctx.throw(401,'用户名或密码不正确')
        }
        const  { _id, name} = user
        const token = jsonwebtoken.sign({_id, name}, config.secret, {expiresIn: '1d'})
        ctx.body = { token }
    }
}

module.exports = new UsersControllers()