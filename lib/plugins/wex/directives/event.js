const recast = require("recast");
// const modifier = ['']
const match = /^@[a-z]+(\.[a-z]+)*$/
let count = 0
module.exports = (utils, config, sfr, filePath, type) => {
  let hasModefys = false
  return {
    match: match,
    before() {
      hasModefys = false
    },
    loading(attr, attrs) {
      let name = attr.name
      let value = attr.value
      let modefys = name.split(/@|\./).slice(1)
      let event = modefys[0]
      if (event === 'click') {
        event = 'tap'
      }
      console.log(modefys)
      modefys = modefys.slice(1)
      let captureIndex = modefys.indexOf('capture')
      ~captureIndex && modefys.splice(captureIndex, 1)
      let stopIndex = modefys.indexOf('stop')
      ~stopIndex && modefys.splice(stopIndex, 1)
      let modefysStr = modefys.length ? `data-wex-modefys${event}="${modefys.join(',')}" data-wex-Method${event}="${value}" data-wex-id="${count++}"` : ''
      if (modefysStr) {
        hasModefys = true
      }
      return ` ${~stopIndex?'capture-':''}${~captureIndex ? 'catch' : 'bind'}:${event}="${modefys.length ? '_eventEmit' : value}" ${modefysStr}`
    },
    end() {
      mixins(sfr, utils, hasModefys)
    }
  }
}



function mixins(sfr, utils, hasModefys) {
  if (sfr.script && hasModefys) {
    let ast = recast.parse(sfr.script.content)
    sfr.script.content = utils.mixins(ast, `{
      methods:{
        _eventEmit(e,...arg) {
          let event = e.type
          let dataset = e.currentTarget.dataset
          let modefys = dataset["wexModefys"+event].split(',')
          let method = dataset["wexMethod" + event]
          let count = dataset["wexId"]
          if(modefys.includes('self') && JSON.stringify(e.currentTarget) !== JSON.stringify(e.target)){
            return false
          }
          if(modefys.includes('once') && this['_wex_'+event+count]){
            return false
          }
          this['_wex_'+event+count] = true
          this[method](e,...arg)
        }
      }
    }`)
  }
}