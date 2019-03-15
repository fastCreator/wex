const observer = require('./observer');
const directives = require('./directives');

module.exports = function (opt) {
  return {
    before(utils, config) {
      observer.before(utils, config)
    },
    async loading(utils, config, rsf, filePath, type) {
      let direcList = directives(utils, config, rsf, filePath, type)
      await observer.loading(utils, config, rsf, filePath, type)
      parseTemplate(rsf.template, direcList, utils)
    }
  }
}

function parseTemplate(template, direcList, utils) {
  if (template) {
    let data = template.content
    let results = ''
    let forStatus = {}
    let forCount = 0
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
          if (forCount) {
            forCount++
          }
          if (/^v-for$/.test(name)) {
            forCount = 1
            forStatus = {}
          }
          if (hook) {
            results += hook.loading(attrs[i], attrs, forStatus)
          } else {
            results += ` ${name}="${value}"`
          }
        }
        results += ">";
      },
      end: function (tag) { //标签结束
        if (forCount > 0) {
          forCount--
        }
        if(forCount===0){
          forStatus = false
        }
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
      it.finish && it.finish()
    })
    template.content = results
  }
}

