module.exports = {
  incoming: function (webhook, params) {
    let lines = [];
    lines.push(`【${webhook.name}】${params.text}`)

    return {
      'content': lines.join("\n"),
    }
  },
  sentry: function (webhook, params) {
    let lines = [];
    lines.push(`【错误级别】${params.level}`)
    lines.push(`【罪魁祸首】${params.culprit}`)

    if (params.extra && params.extra.url) {
      lines.push(`【相关链接】${params.extra.url}`)
    }

    return {
      'url': params.url,
      'title': `【${webhook.name}】${params.message}`,
      'content': renderContent(lines.join("\n"))
    }
  }
}

function renderContent(content) {
  return content.replace(/【(.*)】/ig, '<div class="highlight">【$1】</div>')
}
