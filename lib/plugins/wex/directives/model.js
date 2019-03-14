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
      return ` data-model-key="${value}" bind:input="_modelInput" value="{{${value}}}"`
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
          let o = {}
          o[e.currentTarget.dataset.modelKey] = e.detail.value
          this.setData(o)
        }
      }
    }`)
  }
}