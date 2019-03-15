const recast = require("recast");
module.exports = (utils, config, sfr, filePath, type) => {
  let hasModel = false
  return {
    match: /^v-model$/,
    before() {
      hasModel = false
    },
    loading(attr, attrs) {
      let value = attr.value
      hasModel = true
      return ` data-model-key="${value}" bindinput="_modelInput" value="{{${value}}}"`
    },
    end() {
      mixins(sfr, utils, hasModel)
    }
  }
}


function mixins(sfr, utils, hasModel) {
  if (sfr.script && hasModel) {
    let ast = recast.parse(sfr.script.content)
    sfr.script.content = utils.mixins(ast, `{
      methods:{
        _modelInput(e) {
          let o = this.data
          let arr = e.currentTarget.dataset.modelKey.split('.')
          for(let i = 0;i<arr.length - 1;i++){
            o = o[arr[i]]
          }
          o[arr[arr.length-1]] = e.detail.value
        }
      }
    }`)
  }
}