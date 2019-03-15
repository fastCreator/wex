const recast = require("recast");
const path = require('path');

module.exports = {
  before(utils, config) {
    let inputPath = path.resolve(__dirname, './observer.js')
    utils.copy(inputPath, path.resolve(config.output, './wexLib/observer.js'))
  },
  async loading(utils, config, rsf, filePath, type) {
    if (type !== 'app') {
      let ast = recast.parse(rsf.script.content)
      let relative = path.relative(path.dirname(filePath), config.enter).match(/\.\./g).join('/')
      if (type === 'page') {
        relative = '../' + relative
      }
      let observerPath = relative + '/wexLib/observer.js'
      ast.program.body.unshift(recast.parse(`const observerBehavior = require('${observerPath}')`).program.body[0])
      rsf.script.content = utils.mixins(ast, `{
        behaviors:[observerBehavior]
      }`)
    }
  }
}
