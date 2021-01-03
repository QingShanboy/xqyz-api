const redis = require('redis')
const { promisifyAll } = require('bluebird')
const config = require('./index')

const options = {
    host: config.Redis_URL.host,
    port: config.Redis_URL.port,
    detect_buffers: true,
    retry_strategy: function (options) {
      if (options.error && options.error.code === 'ECONNREFUSED') {
        // End reconnecting on a specific error and flush all commands with
        // a individual error
        return new Error('The server refused the connection');
      }
      if (options.total_retry_time > 1000 * 60 * 60) {
        // End reconnecting after a specific timeout and flush all commands
        // with a individual error
        return new Error('Retry time exhausted');
      }
      if (options.attempt > 10) {
        // End reconnecting with built in error
        return undefined;
      }
      // reconnect after
      return Math.min(options.attempt * 100, 3000);
    }
}
// const client = redis.createClient(options)

const client = promisifyAll(redis.createClient(options))
const setValue = (key,value) => {
  console.log(key,value)
    if(typeof value === 'undefined' || value === 'null' || value === '') {
        return
    }
    if(typeof value === 'string') {
        if (typeof time !== 'undefined') {
          client.set(key, value, 'EX', time)
        } else {
          client.set(key, value)
        }
    } else if(typeof value === 'object') {
        Object.keys(value).forEach((item) => {
            client.hset(key, item, value[item], redis.print)
        })
    }
}
const getValue = (key) => {
  return client.getAsync(key)
}
const getHValue = (key) => {
    // v8 Promisify method use util, must node > 8
    // return promisify(client.hgetall).bind(client)(key)
  
    // bluebird async
    return client.hgetallAsync(key)
  }
  
const delValue = (key) => {
    client.del(key, (err, res) => {
      if (res === 1) {
        console.log('delete successfully');
      } else {
        console.log('delete redis key error:' + err)
      }
    })
  }
 module.exports = {
    client,
    setValue,
    getValue,
    getHValue,
    delValue
  }