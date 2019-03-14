const recast = require("recast");
const path = require('path');

module.exports = {
  before(utils, config) {
    let inputPath = path.resolve(__dirname, './computed.js')
    utils.copy(inputPath, path.resolve(config.output, './wexLib/computed.js'))
  },
  async loading(utils, config, rsf, filePath, type) {
    if (type !== 'app') {
      let ast = recast.parse(rsf.script.content)
      let relative = path.relative(path.dirname(filePath), config.enter).match(/\.\./g).join('/')
      if (type === 'page') {
        relative = '../' + relative
      }
      let computedPath = relative + '/wexLib/computed.js'
      ast.program.body.unshift(recast.parse(`const computedBehavior = require('${computedPath}')`).program.body[0])
      rsf.script.content = utils.mixins(ast, `{
        behaviors:[computedBehavior]
      }`)
    }
  }
}
