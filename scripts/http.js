// Description:
//   http server
//
// Dependencies:
//   "hubot-redis-brain": "0.0.4"
//
// Configuration:
//   none
//
// Commands:
//   none

const wxwork = require('../lib/wxwork')
const handlers = require('../lib/webhook_handlers')
const axios = require('axios')

module.exports = (robot) => {
  robot.router.post('/:type/:token', (req, res) => {
    const type = req.params.type
    const token = req.params.token
    const webhooks = robot.brain.get('webhooks', {})

    if (!webhooks[token]) {
      return res.send("Invalid token")
    }

    webhook = webhooks[token]
    const chatId = webhook['chat_id']
    const message = resolveMessageObject(type, req.body)

    if (message === false) {
      res.send('Invalid handler')
    }

    async function sendMessage(chatId, message){
      let response = await wxwork.sendMessage(chatId, message)
      if (response.ok) {
        res.send(message)
      } else {
        res.send(response.message)
      }
    }

    sendMessage(chatId, message)
  })

  robot.router.post('/wxwork_webhook/:type/:token', (req, res) => {
    const type = req.params.type
    const token = req.params.token
    const message = resolveMessageObject(type, req.body)

    let data = {
      msgtype: 'text',
      text: {
        content: message
      }
    }

    const url = `https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=${token}`
    axios.post(url, data).then((resp) => {
      if (resp.data.errmsg != 'ok') {
        console.log(resp.data.errmsg)
      } else {
        console.log(message)
      }
    }).catch((error) => {
      console.log(error)
    })
  })
}

function resolveMessageObject(name, params) {
  try {
    return handlers[name](params)
  } catch (error) {
    console.error(error)
    return false
  }
}
