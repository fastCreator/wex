const recast = require("recast");
module.exports = (utils, config, sfr, filePath, type) => {
  return {
    match: /^:key$/,
    before() {
    },
    loading(attr, attrs) {
      let value = attr.value
      return ` wx:key="{{${value}}}"`
    },
    end() {
    }
  }
}
