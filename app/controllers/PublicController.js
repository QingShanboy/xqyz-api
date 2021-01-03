const svgCaptcha = require('svg-captcha')
const RedisConfig = require('../config/RedidConfig')


class PublicController {
  constructor() {}
    async getCaptcha (ctx) {
      const  body = ctx.request.query
      const newCaptcha = svgCaptcha.create({
        size: 4 ,// 验证码长度
        ignoreChars: '0o1i' ,// 验证码字符中排除 0o1i
        noise: Math.floor(Math.random() * 4) ,// 干扰线条的数量
        color: true ,// 验证码的字符是否有颜色，默认没有，如果设定了背景，则默认有
        // background: // 验证码图片背景颜色
        width:100,
        height:34
      })
        // 保存图片验证码数据，设置超时时间，单位: s
        // 设置图片验证码超时10分钟
      RedisConfig.setValue(body.sid, newCaptcha.text, 10 * 60)
      ctx.body = {
        code:200,
        data: newCaptcha.data
      }
    }
}

module.exports = new PublicController()
