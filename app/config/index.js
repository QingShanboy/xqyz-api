const DB_URL = "mongodb://127.0.0.1:27017/dbTest"
const Redis_URL = {
    host:'127.0.0.1',
    port: 6379,
}
const secret = "xqyz-jwt-secret"
module.exports = {
    DB_URL,
    secret,
    Redis_URL
}
