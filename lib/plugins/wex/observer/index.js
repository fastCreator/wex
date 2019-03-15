const recast = require("recast");
const path = require('path');

module.exports = {
  before(utils, config) {
    let inputPath = path.resolve(__dirname, './observer')
    utils.copy(inputPath, path.resolve(config.output, './wexLib/observer'))
  },
  async loading(utils, config, rsf, filePath, type) {
    if (type !== 'app') {
      let ast = recast.parse(rsf.script.content)
      let relative = path.relative(path.dirname(filePath), config.enter).match(/\.\./g).join('/')
      if (type === 'page') {
        relative = '../' + relative
      }
      let observerdPath = relative + '/wexLib/observer/index.js'
      ast.program.body.unshift(recast.parse(`const observerdBehavior = require('${observerdPath}')`).program.body[0])
      rsf.script.content = utils.mixins(ast, `{
        behaviors:[observerdBehavior]
      }`)
    }
  }
}
