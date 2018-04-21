# hwamei

hwamei 是一个基于 hubot 的企业微信聊天机器人，它能够通过 webhook 将收集的信息发送到企业微信群中。

## 安装

- `git clone https://github.com/uniqueway/hwamei.git`
- `npm install`
- `./bin/hubot`

## 部署

见 https://github.com/hubotio/hubot/blob/master/docs/deploying.md

## 企业微信相关命令

- `hwamei>wxwork create chat {chatid} with {users}` 创建一个群
- `hwamei>wxwork destroy chat {chatid}` 删除一个群
- `hwamei>wxwork show {chatid}` 显示群信息
- `hwamei>wxwork add {userid} to {chatid}` 添加用户到指定群
- `hwamei>wxwork remove {userid} from {chatid}` 从指定群中删除用户

## webhook相关命令
- `hwamei>create webhook {name} from {type} to {chatid}` 创建一个 webhook
- `hwamei>list webhooks` 列出所有 webhook
- `hwamei>delete webhook {token}` 删除一个 webhook
- `hwamei>delete all webhook` 删除所有 webhook

## 扩展

查看 https://github.com/hubotio/hubot/blob/master/docs/scripting.md
