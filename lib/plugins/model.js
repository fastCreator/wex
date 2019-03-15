const path = require('path');
const less = require('less');
const recast = require("recast");
module.exports = function (opt) {
  return {
    // before(utils, config) {
    //   utils.addMixin(`{
    //     methods:{
    //       _modelInput(e) {
    //         let o = {}
    //         o[e.currentTarget.dataset.modelKey] = e.detail.value
    //         this.setData(o)
    //       }
    //     }
    //   }`)
    // },
    async loading(utils, config, rsf, filePath) {
      let template = rsf.template
      if (!template) {
        return Promise.resolve()
      } else {
        let hasModel = false
        let results = ''
        let data = template.content
        utils.htmlParse(data, {
          start: function (tag, attrs, unary) { //标签开始
            results += "<" + tag;
            for (var i = 0; i < attrs.length; i++) {
              let name = attrs[i].name
              let value = attrs[i].escaped
              if (name === 'v-model') {
                hasModel = true
                results += ` data-model-key="${value}"`
                results += ` bindinput="_modelInput"`
                results += ` value="{{${value}}}"`
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
        template.content = results
        mixins(rsf, utils, hasModel)
        return Promise.resolve()
      }
    }
  }
}

function mixins(sfr, utils, hasModel) {
  if (sfr.script && hasModel) {
    let ast = recast.parse(sfr.script.content)
    sfr.script.content = utils.mixins(ast, `{
      methods:{
        _modelInput(e) {
          this[e.currentTarget.dataset.modelKey] = e.detail.value
        }
      }
    }`)
  }
}