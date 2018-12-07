// Description:
//   wxwork app management commands
//
// Dependencies:
//   "hubot-redis-brain": "0.0.4"
//
// Configuration:
//   WXWORK_CORP_ID
//   WXWORK_APP_SECRET
//   WXWORK_CHAT_DEFAULT_OWNER
//
// Commands:
//   wxwork create chat {chatid} with {users}
//   wxwork destroy chat {chatid}
//   wxwork add {userid} to {chatid}
//   wxwork remove {userid} from {chatid}

const wxwork = require('../lib/wxwork')

module.exports = (robot) => {
  robot.hear(/wxwork create chat (.*) with (.*)/i, (res) => {
    const name = res.match[1]
    const users = res.match[2].split(',')

    async function createChat(){
      const response = await wxwork.createChat(name, users)
      if (response.ok) {
        const chatId = response.data.chatid
        const message = `Chat ${chatId} was created`
        wxwork.sendMessage(chatId, message)
        res.send(message)
      } else {
        res.send(response.message)
      }
    }

    createChat()
  })

  robot.hear(/wxwork destroy chat (.*)/i, (res) => {
    res.send("Sorry, I can't destroy chat still now")
  })

  robot.hear(/wxwork send (.*) to (.*)/i, (res) => {
    async function sendMessage(chatId, message){
      const response = await wxwork.sendMessage(chatId, message)
      if (response.ok) {
        res.send('Message was send')
      } else {
        res.send(response.message)
      }
    }

    const chatId = res.match[2]
    const message = res.match[1]

    sendMessage(chatId, message)
  })

  robot.hear(/wxwork add (.*) to (.*)/i, (res) => {
    async function addUserToChat(chatId, users){
      const response = await wxwork.addUserToChat(chatId, users)
      if (response.ok) {
        const message = `${users.join(', ')} was added to ${chatId}`
        res.send(message)
      } else {
        res.send(response.message)
      }
    }

    const chatId = res.match[2]
    const users = res.match[1].split(',')

    addUserToChat(chatId, users)
  })

  robot.hear(/wxwork remove (.*) from (.*)/i, (res) => {
    async function removeUserFromChat(chatId, users){
      const response = await wxwork.removeUserFromChat(chatId, users)
      if (response.ok) {
        const message = `${users.join(', ')} was removed from ${chatId}`
        res.send(message)
      } else {
        res.send(response.message)
      }
    }

    const chatId = res.match[2]
    const users = res.match[1].split(',')

    removeUserFromChat(chatId, users)
  })

  robot.hear(/wxwork show chat (.*)/, (res) => {
    async function showChat(chatId){
      const response = await wxwork.showChat(chatId)
      if (response.ok) {
        res.send(console.log(response.data))
      } else {
        res.send(response.message)
      }
    }

    const chatId = res.match[1]

    showChat(chatId)
  })

  robot.hear(/wxwork message (.*) to (.*)/, (res) => {
    const message = res.match[1]
    const chatId = res.match[2]
    wxwork.sendMessage(chatId, message)
  })
}
