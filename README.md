# hwamei

hwamei 是一个基于 hubot 的企业微信聊天机器人，它能够通过 webhook 将收集的信息发送到企业微信群中。

## 安装使用

`git clone https://github.com/uniqueway/hwamei.git`
`npm install`
`./bin/hubot`

## 部署

见 https://github.com/hubotio/hubot/blob/master/docs/deploying.md

## 企业微信相关命令

- `hwamei>wxwork create chat {chatid} with {users}` 创建一个群
- `hwamei>wxwork destroy chat {chatid}` 删除一个群
- `hwamei>wxwork show {chatid}` 显示群信息
- `hwamei>wxwork add {userid} to {chatid}` 添加用户到指定群
- `hwamei>wxwork remove {userid} from {chatid}` 从指定群中删除用户

## webhook相关命令
- `hwamei>create webhook {name} from {type} to {chatid}`
- `hwamei>list webhooks`
- `hwamei>delete webhook {token}`
- `hwamei>delete all webhook`

## 扩展

查看 https://github.com/hubotio/hubot/blob/master/docs/scripting.md
