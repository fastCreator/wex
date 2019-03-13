const recast = require("recast");
const utils = require('../utils')
const pluginLoader = require('./plugin-loader')
const AST = require('./ast')
const writeWex = require('./writeWex')

module.exports = async (filePath, config, type) => {
  let sfc = await utils.getrsf(filePath)
  await pluginLoader.hookPlugin('loading', config, sfc, filePath, type)
  mixinsAll(sfc)
  await writeWex(sfc, filePath, config, type)
  await pluginLoader.hookPlugin('after', config, sfc, filePath, type)
  return sfc
}

function clearSlash(text) {
  return text.replace(/\/\/\n/g, '')
}



function mixinsAll(sfc) {
  if (sfc.script) {
    let ast = recast.parse(sfc.script.content)
    let res = AST.mixinsAll(ast)
    if (res) {
      sfc.script.content = res
    }
  }
}