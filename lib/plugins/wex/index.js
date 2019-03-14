const computed = require('./computed');
const directives = require('./directives');

module.exports = function (opt) {
  return {
    before(utils, config) {
      computed.before(utils, config)
    },
    async loading(utils, config, rsf, filePath, type) {
      let direcList = directives(utils, config, rsf, filePath, type)
      await computed.loading(utils, config, rsf, filePath, type)
      parseTemplate(rsf.template, direcList, utils)
    }
  }
}

function parseTemplate(template, direcList, utils) {
  if (template) {
    let data = template.content
    let results = ''
    direcList.forEach(it => {
      it.before && it.before()
    })
    utils.htmlParse(data, {
      start: function (tag, attrs, unary) { //标签开始
        results += "<" + tag;
        for (var i = 0; i < attrs.length; i++) {
          let name = attrs[i].name
          let value = attrs[i].value
          let hook = direcList.find(it => it.match.test(name))
          if (hook) {
            results += hook.loading(attrs[i], attrs)
          } else {
            results += ` ${name}="${value}"`
          }
        }
        results += ">";
      },
      end: function (tag) { //标签结束
        results += "</" + tag + ">";
      },
      chars: function (text) { //文本
        results += text;
      },
      comment: function (text) { //注释
        results += "<!--" + text + "-->";
      }
    })
    direcList.forEach(it => {
      it.end && it.end()
    })
    template.content = results
  }
}

