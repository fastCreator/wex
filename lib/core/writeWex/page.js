const utils = require('../../utils')
const AST = require('../ast')
const recast = require("recast");
const path = require("path");
module.exports = function (sfc, filePath, config) {
  let basename = 'component_' + path.basename(filePath, config.extname);
  let ast = recast.parse(sfc.script.content)
  let events = getPageEvents(ast)
  let styles = sfc.styles.reduce((a, b) => a + b.content, '')
  let script = dealScript(ast, events.properties)
  let template = sfc.template ? sfc.template.content : ''
  let compliePath = utils.getWexcompliePath(filePath, config)
  let json = utils.getJSONExtname(sfc) || {}
  let componentJSON = JSON.stringify({
    usingComponents: json.usingComponents || {}
  })
  let pageJSON = JSON.stringify(Object.assign(json, { "usingComponents": { "my-page": `./${basename}/index` } }))
  json.component = true
  utils.writeFile(compliePath.json, pageJSON)
  utils.writeFile(compliePath.template, '<my-page id="myPage"></my-page>')
  utils.writeFile(compliePath.script, getPageContent(events.keys))
  let componentsPath = utils.getWexcompliePath(filePath, config, `../${basename}/index`)
  utils.writeFile(componentsPath.style, styles)
  utils.writeFile(componentsPath.script, script)
  utils.writeFile(componentsPath.json, componentJSON)
  utils.writeFile(componentsPath.template, template)
}

function dealScript(ast, properties) {
  if (!ast) {
    return ''
  }
  let methods = ast.program.body.find(it=>it.type==='ExportDefaultDeclaration').declaration.properties.find(it=>it.key.name === 'methods')
  AST.replaceExport(ast, 'Component')
  if(methods){
    properties.forEach(it => {
      methods.value.properties.push(it)
    })
  }else{
    utils.printError('请添加methods属性')
  }
  
  return recast.print(ast).code
}

function getPageEvents(ast) {
  let body = ast.program.body
  for (let i = 0; i < body.length; i++) {
    let line = body[i]
    let deleteindex
    if (line.type === 'ExportDefaultDeclaration') {
      let orginAST = line.declaration.properties.find((it,i) => {
        deleteindex = i
        return it.key.name === 'pageEvents'
      })
      if (orginAST) {
        line.declaration.properties.splice(deleteindex,1)
        let properties = orginAST.value.properties
        return {
          keys: properties.map(it => it.key.name),
          properties: properties
        }
      }
    }
  }
}

function getPageContent(keys) {
  let str = ''
  keys.forEach(it => {
    str += `${it}(){
      this.selectComponent('#myPage').${it}()
    },`
  })
  str = str.slice(0, -1)
  return `
  Page({
    ${str}
  })
  `
}