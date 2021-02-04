const jwt = require('koa-jwt')
const {secret} = require('../config/index')
const Router = require('koa-router');
const router = new Router({ prefix: '/articles/:articleId/comments' });
const {
  find, findById, create, update, delete: del,
  checkCommentExist, checkCommentator,
} = require('../controllers/comments')

const auth = jwt({ secret })

router.post('/', auth, create);

router.get('/', find)

router.get('/:id', checkCommentExist, findById);

router.patch('/:id', auth, checkCommentExist, checkCommentator, update);

router.delete('/:id', auth, checkCommentExist, checkCommentator, del);

module.exports = router;