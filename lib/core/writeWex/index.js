let app = require('./app')
let component = require('./component')
let page = require('./page')

module.exports = async function (sfc, filePath, config, type) {
  if (type === 'page') {
    await page(sfc, filePath, config)
  } else if (type === 'component') {
    await component(sfc, filePath, config)
  } else if (type === 'app') {
    await app(sfc, filePath, config)
  }
}