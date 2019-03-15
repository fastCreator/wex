const recast = require("recast");
module.exports = (utils, config, sfr, filePath, type) => {
  return {
    match: /^v-for$/,
    before() {
    },
    loading(attr, attrs, forStatus) {
      let name = attr.name
      let value = attr.value
      let m = value.match(/^\(\s*(\w+)\s*\,\s*(\w+)\s*\)\s*in\s*(\w+)\s*$/)
      let i = 'index', it, list
      if (m) {
        it = m[1]
        i = m[2]
        list = m[3]
      } else {
        m = value.match(/^\s*(\w+)\s*in\s*(\w+)\s*$/)
        it = m[1]
        list = m[2]
      }
      Object.assign(forStatus,{
        list:list,
        index: i,
        it:it
      })
      return ` wx:for="{{${list}}}" wx:for-index="${i}" wx:for-item="${it}"`
    }
  }
}
