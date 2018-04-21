// Description:
//   webhook management commands
//
// Dependencies:
//   "hubot-redis-brain": "0.0.4"
//
// Configuration:
//   none
//
// Commands:
//   create webhook {name} from {type} to {chat_id}
//   list webhook
//   delete webhook {token}
//   delete all webhook

const wxwork = require('../lib/wxwork')
const handlers = require('../lib/webhook_handlers')

module.exports = (robot) => {
  robot.hear(/create webhook (.*) from (.*) to (.*)/, (res) => {
    const name = res.match[1]
    const type = res.match[2]
    const chatId = res.match[3]
    const token = generateUUID()

    if (!handlers[type]) {
      res.send(`Invalid type webhook`)
      return
    }

    const url = `/${type}/${token}`
    let webhook = {
      'name': name,
      'type': type,
      'token': token,
      'chat_id': chatId,
      'url': url
    }

    let webhooks = robot.brain.get("webhooks") || {}
    webhooks[token] = webhook
    robot.brain.set('webhooks', webhooks)

    res.send(`There is your webhook url: ${url}`)
  })

  robot.hear(/list webhooks?/, (res) => {
    let lines = ['']
    let webhooks = robot.brain.get("webhooks") || {}
    for(let token in webhooks) {
      let webhook = webhooks[token]
      lines.push(`name: ${webhook.name}, type: ${webhook.type}, chat_id: ${webhook.chat_id}, url: ${webhook.url}`)
    }

    res.send(lines.join("\n"))
  })

  robot.hear(/delete all webhook[s]?/, (res) => {
    robot.brain.set('webhooks', {})
    res.send('done')
  })

  robot.hear(/delete webhook (.*)/, (res) => {
    const token = res.match[1]
    let webhooks = robot.brain.get('webhooks') || {}
    delete webhooks[token]

    res.send('done')
  })

  robot.router.post('/:type/:token', (req, res) => {
    const type = req.params.type
    const token = req.params.token
    const webhooks = robot.brain.get('webhooks', {})

    if (!webhooks[token]) {
      return res.send("Invalid token")
    }

    webhook = webhooks[token]
    const chatId = webhook['chat_id']
    const messageObject = resolveMessageObject(type, webhook, req.body)

    if (messageObject === false) {
      res.send('Invalid handler')
    }

    async function sendMessage(chatId, messageObject){
      let response
      if (messageObject.title) {
        response = await wxwork.sendCard(chatId,
          messageObject.title, messageObject.content, messageObject.url)
      } else {
        response = await wxwork.sendMessage(chatId,
          messageObject.content)
      }

      if (response.ok) {
        res.send('OK')
      } else {
        res.send(response.message)
      }
    }

    sendMessage(chatId, messageObject)
  })
}

function resolveMessageObject(name, webhook, params) {
  try {
    return handlers[name](webhook, params)
  } catch (error) {
    console.error(error)
    return false
  }
}

function generateUUID(){
    var d = new Date().getTime()
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (d + Math.random()*16)%16 | 0
        d = Math.floor(d/16)
        return (c=='x' ? r : (r&0x7|0x8)).toString(16)
    });
    return uuid
}
