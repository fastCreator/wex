
const path = require('path');
var sass = require('node-sass');
module.exports = function (opt) {
  return {
    async loading(utils, config, resf, filePath) {
      let basePath = path.dirname(filePath)
      let styles = resf.styles
      for (let i = 0; i < styles.length; i++) {
        let style = styles[i]
        let text = style.content
        if (style.lang === 'scss') {
          style.content = await parseSass(text, basePath).catch(err => { utils.error(err, 'scss解析失败') })
        }
      }
    }
  }
}

function parseSass(content, oldfilePath) {
  return new Promise((resolve, reject) => {
    sass.render({
      data: content,
      includePaths: [oldfilePath]
    }, function (err, result) {
      if (err) {
        reject(err)
      } else {
        resolve(result.css)
      }
    })
  })
}
