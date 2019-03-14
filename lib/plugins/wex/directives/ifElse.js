const recast = require("recast");
module.exports = (utils, config, sfr, filePath, type) => {
  return {
    match: /^v-if$|^v-else-if$|^v-else$/,
    before() {
    },
    loading(attr, attrs) {
      let name = attr.name
      let value = attr.value
      if(name === 'v-if'){
        return ` wx:if="{{${value}}}"`
      }else if(name === 'v-else'){
        return ` wx:else`
      }else if(name === 'v-else-if'){
        return ` wx:elif="{{${value}}}"`
      }
    },
    end() {
    }
  }
}
