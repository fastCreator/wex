const recast = require("recast");
module.exports = (utils, config, sfr, filePath, type) => {
  return {
    match: /^v-show$|^v-hidden$/,
    before() {
    },
    loading(attr, attrs) {
      let name = attr.name
      let value = attr.value
      if (name === 'v-show') {
        return ` hidden="{{!${value}}}"`
      } else {
        return ` hidden="{{${value}}}"`
      }

    },
    end() {
    }
  }
}
