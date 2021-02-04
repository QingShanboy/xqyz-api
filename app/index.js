const Koa = require('koa')
const path = require('path')
// const bodyparser = require('koa-bodyparser')
const koaBody = require('koa-body')

const cors = require('@koa/cors')
const koaStatic = require('koa-static')
const error = require('koa-json-error')
const parameter = require('koa-parameter')
const app = new Koa()
const routing = require('./routes')
// const errorHandle = require('./component/errorHandle')


// app.use(error())
app.use(koaStatic(path.join(__dirname, 'public')));
app.use(error({
  postFormat: (e, { stack, ...rest }) => process.env.NODE_ENV === 'production' ? rest : { stack, ...rest }
}))
// app.use(koaBody({
//   multipart: true,
//   formidable: {
//     uploadDir: path.join(__dirname, '/public/uploads'),
//     keepExtensions: true,
//   }
// }))
// app.use(errorHandle)
app.use(cors())
app.use(koaBody({
    multipart: true,
    formidable: {
        uploadDir: path.join(__dirname, '/public/uploads'),
        keepExtensions: true
    }
}))
app.use(parameter(app))
routing(app);

app.listen(3001)