const jwt = require('koa-jwt')
const {secret} = require('../config/index')
const Router = require('koa-router')
const router = new Router({prefix: '/users'})

const { 
        getUser, getUserProfile, createUser, regist,
        updateUser, deleteUser, login, chexkOwner,
        getFollowing, getFollowers, checkUserExist, follow,
        unfollow, addUserChannels, unUserChannels, getUserChannels,
        likeArticle,unlikeArticle,collectArticle,cancelCollectArticle,
        getLikeArticlesByUserId,getCollectArticlesByUserId
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


router.post('/', createUser)

router.patch('/:id', auth, chexkOwner, updateUser)

router.delete('/:id', auth, chexkOwner, deleteUser)
//登录
router.post('/login', login)

router.post('/regist', regist)
router.get('/:id/following', getFollowing)
router.get('/:id/followers', getFollowers)
router.put('/following/:id', auth, checkUserExist, follow)
router.delete('/following/:id', auth, checkUserExist, unfollow)
router.get('/userChannels', auth, getUserChannels)
router.delete('/unChannels/:id', auth, unUserChannels)

router.put('/addChannels/:id', auth, addUserChannels)

// 文章点赞
router.put('/likeArticle/:id', auth, likeArticle)

// 文章取消赞
router.delete('/unlikeArticle/:id', auth, unlikeArticle)

// 文章收藏
router.put('/collectArticle/:id', auth, collectArticle)

// 文章取消收藏
router.delete('/cancelCollectArticle/:id', auth, cancelCollectArticle)

 // 根据用户id返回用户点赞过的所有文章
 router.get('/:id/likeArticles', auth, getLikeArticlesByUserId)
 
 // 根据用户id返回用户收藏过的所有文章
 router.get('/:id/collectArticles', auth, getCollectArticlesByUserId)

router.get('/:id', getUserProfile)
module.exports = router