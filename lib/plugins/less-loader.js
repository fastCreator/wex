const path = require('path');
const less = require('less');
module.exports = function (opt) {
  return {
    async loading(utils, config, resf, filePath) {
      let basePath = path.dirname(filePath)
      let styles = resf.styles
      for (let i = 0; i < styles.length; i++) {
        let style = styles[i]
        let text = style.content
        if (style.lang === 'less') {
          let res = await less.render(text, { compress: false, paths: [basePath] }).catch(err => { utils.error(err, 'less解析失败') })
          style.content = res.css
        }
      }
    }
  }
}