require('dotenv').config()
const wxwork = require('wxwork-api')

const CORP_ID = process.env.WXWORK_CORP_ID
const APP_SECRET = process.env.WXWORK_APP_SECRET
const ACCESS_TOKEN_CACHE = new Map()

const client = new wxwork(CORP_ID, APP_SECRET, {
  setAccessToken: (...rest) => ACCESS_TOKEN_CACHE.set(...rest),
  getAccessToken: (...rest) => ACCESS_TOKEN_CACHE.get(...rest)
})

const dataObject = function(response){
  if (response.data.errcode == '0') {
    this.ok = true
    this.data = response.data
    this.message = 'OK'
  } else {
    this.ok = false
    this.data = response.data
    this.message = `Request error: ${response.data.errmsg}`
  }
}

const errorObject = function(error) {
  this.ok = false
  this.data = {}
  this.message = error
}

module.exports = {
  createChat: async (name, users, owner = process.env.WXWORK_CHAT_DEFAULT_OWNER) => {
    try {
      let response = await client.post('appchat/create', {
        name: name,
        chatid: name,
        owner: owner,
        userlist: users
      })

      return new dataObject(response)
    } catch (error) {
      return new errorObject(error)
    }
  },

  sendMessage: async (chatId, content) => {
    try {
      let response = await client.post('appchat/send', {
        'chatid': chatId,
        'msgtype': 'text',
        'text': {
          'content' : `${content}`
        }
      })

      return new dataObject(response)
    } catch (error) {
      return new errorObject(error)
    }
  },

  sendCard: async (chatId, title, message, url, btnText = '更多') => {
    try {
      let response = await client.post('appchat/send', {
        'chatid': chatId,
        'msgtype': 'textcard',
        'textcard': {
          'title': title,
          'description': `${message}`,
          'url': url,
          'btntxt': btnText
        }
      })

      return new dataObject(response)
    } catch (error) {
      return new errorObject(error)
    }
  },

  addUserToChat: async (chatId, users) => {
    try {
      let response = await client.post('appchat/update', {
        chatid: chatId,
        add_user_list: users,
      })

      return new dataObject(response)
    } catch (error) {
      return new errorObject(error)
    }
  },

  removeUserFromChat: async (chatId, users) => {
    try {
      let response = await client.post('appchat/update', {
        chatid: chatId,
        del_user_list: users
      })

      return new dataObject(response)
    } catch (error) {
      return new errorObject(error)
    }
  },

  showChat: async (chatId) => {
    try {
      let response = await client.get('appchat/get', {
        chatid: chatId,
      })

      return new dataObject(response)
    } catch (error) {
      return new errorObject(error)
    }
  }
}
