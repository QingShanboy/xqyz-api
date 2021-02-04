const jwt = require('koa-jwt')
const {secret} = require('../config/index')
const Router = require('koa-router')
const router = new Router({prefix: '/channels'})

const { 
        getChannels, getChannelsById, createChannels,
        updateChannels, getArticles, getDefaultChannels
    } = require('../controllers/channels')


const auth = jwt({secret})
router.get('/', getChannels)

router.post('/', auth, createChannels)

router.patch('/:id', auth, updateChannels)

router.get('/defaultChannels', auth, getDefaultChannels)

router.get('/:id', getChannelsById)

router.get('/:id/artic', getArticles)

// router.get('/:id/following', getFollowing);
// router.get('/:id/followers', getFollowers);
// router.put('/following/:id', auth, checkChannelsExist, follow);
// router.delete('/following/:id', auth, checkChannelsExist, unfollow);

module.exports = router