const jwt = require('koa-jwt')
const {secret} = require('../config/index')
const Router = require('koa-router')
const router = new Router({prefix: '/articles'})

const { 
        addArticle, getArticles, checkArticleExist, 
        getArticleById, checkArticleOwner, editArticle, 
        deleteArticle, getHotArticle,listArticleById
    } = require('../controllers/artic')

const auth = jwt({secret})

// 获取所有的文章
router.get('/', getArticles)

// 根据文章id返回文章的详情
router.get('/:id', auth,checkArticleExist, getArticleById)

router.get('/artic/:id', checkArticleExist, listArticleById)


// 添加文章
router.post('/:id', auth, addArticle)

// 获取热门文章
router.post('/hot', getHotArticle)

// 编辑文章
router.patch('/:id', auth,  checkArticleExist, checkArticleOwner, editArticle)

// 删除文章
router.delete('/:id', auth, checkArticleExist, checkArticleOwner, deleteArticle)

module.exports = router