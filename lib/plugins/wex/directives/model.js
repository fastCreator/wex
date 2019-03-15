const recast = require("recast");
module.exports = (utils, config, sfr, filePath, type) => {
  let hasModel = false
  return {
    match: /^v-model$/,
    before() {
      hasModel = false
    },
    loading(attr, attrs, forStatus) {
      let value = attr.value
      let forStr = ''
      hasModel = true
      if(forStatus){
        forStr = `data-for-index-name="${forStatus.index}" data-for-index-value="{{${forStatus.index}}}" data-for-index-item="${forStatus.it}" data-for-index-list="${forStatus.list}"` 
      }
      return ` data-model-key="${value}" bindinput="_modelInput" value="{{${value}}}" ${forStr}`
    },
    finish() {
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
          let dataset = e.currentTarget.dataset
          if(dataset.forIndexName){
            let name = dataset.forIndexName
            let value = dataset.forIndexValue
            let item = dataset.forIndexItem
            let list = dataset.forIndexList
            dataset.modelKey = dataset.modelKey.replace(new RegExp('^'+item+'($|[\\.\\[])'),list+'['+value+']'+'$1')
            dataset.modelKey = dataset.modelKey.replace(new RegExp('\\\\[\\s*'+name+'\\s*\\\\]'),'['+value+']')
          }
          let arr = dataset.modelKey.split('.')
          for(let i = 0;i<arr.length - 1;i++){
            o = o[arr[i]]
          }
          o[arr[arr.length-1]] = e.detail.value
        }
      }
    }`)
  }
}