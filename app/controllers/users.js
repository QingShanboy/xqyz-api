const jsonwebtoken = require('jsonwebtoken')
const User = require('../models/users')
const config = require('../config/index')
const { checkCode } = require('../component/utils')

class UsersControllers{
    async getUser(ctx) {
        ctx.body = await User.find()
    }
    async getUserId(ctx) {
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
                token 
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
}

module.exports = new UsersControllers()