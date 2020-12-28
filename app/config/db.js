const mongoose = require('mongoose')
const config = require('./index')

//创建连接
mongoose.connect(config.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

//连接成功
mongoose.connection.on('connected', () => {
    console.log('Mongsooe connection open to ' + 
    config.DB_URL)
})

//连接异常
mongoose.connection.on('error', (err) =>{
    console.log('Mongsooe connection error' + err)
})

//断开连接
mongoose.connection.on('disconnected', () => {
    console.log('Mongsooe connection disconnected')
})

module.exports = mongoose