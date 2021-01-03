
const Router = require('koa-router')
const publicController = require('../controllers/PublicController')

const router = new Router()

router.get('/getCaptcha', publicController.getCaptcha)

module.exports = router