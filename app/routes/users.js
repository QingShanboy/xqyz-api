const jwt = require('koa-jwt')
const {secret} = require('../config/index')
const Router = require('koa-router')
const router = new Router({prefix: '/users'})

const { 
        getUser, getUserById, createUser, regist,
        updateUser, deleteUser, login, chexkOwner,
    } = require('../controllers/users')


const auth = jwt({secret})
// async (ctx, next) => {
//     const { authorization = '' } = ctx.request.header
//     const token = authorization.replace('Bearer ', '')
//     try {
//         const user = jsonwebtoken.verify(token, config.secret)
//         ctx.state.user = user
//     } catch (err) {
//         ctx.throw(401, err.message)
//     }
//     await next()
// }
router.get('/', getUser)

router.get('/:id', getUserById)

router.post('/', createUser)

router.patch('/:id', auth, chexkOwner, updateUser)

router.delete('/:id', auth, chexkOwner, deleteUser)

router.post('/login', login)

router.post('/regist', regist)

module.exports = router