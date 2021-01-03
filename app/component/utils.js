const { getValue } = require('../config/RedidConfig')


const checkCode = async (key, value) => {
    const redisData = await getValue(key)
    if(redisData != null) {
        if(redisData.toLowerCase() === value.toLowerCase()) {
            return true
        } else {
            return false
        }
    } else {
        return false
    }
}

module.exports = {
    checkCode
}