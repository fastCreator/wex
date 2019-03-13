const utils = require('../../utils')
const AST = require('../ast')
var recast = require("recast");
module.exports = function (sfc, filePath, config) {
  let styles = sfc.styles.reduce((a, b) => a + b.content, '')
  let script = dealScript(sfc.script)
  let template = sfc.template ? sfc.template.content : ''
  let json = utils.getJSONExtname(sfc) || {}
  json.component = true
  let compliePath = utils.getWexcompliePath(filePath, config)
  utils.writeFile(compliePath.style, styles)
  utils.writeFile(compliePath.script, script)
  utils.writeFile(compliePath.json, JSON.stringify(json))
  utils.writeFile(compliePath.template, template)
}

function dealScript(script){
  if(!script){
    return ''
  }
  let str = script.content
  let ast = recast.parse(str)
  AST.replaceExport(ast,'Component')
  return recast.print(ast).code
}