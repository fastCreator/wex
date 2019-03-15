const recast = require("recast");
const builders = recast.types.builders;
const { expressionStatement, callExpression, identifier } = builders
const wxClass = ['Page', 'App', 'Component']
let mixinsList = []

function mixins(ast, mixin) {
  let mixinAST
  if (typeof (mixin) === 'object') {
    mixin = JSON.stringify(mixin)
  }
  mixinAST = recast.parse(`var mixin = ${mixin}`).program.body[0].declarations[0].init;
  ast.program.body.forEach(line => {
    if (line.type === 'ExportDefaultDeclaration') {
      let orginAST = line.declaration.properties
      for (let i = 0; i < mixinAST.properties.length; i++) {
        let mixinItem = mixinAST.properties[i]
        let key = mixinItem.key.name
        let value = mixinItem.value
        let orginItem = orginAST.find(it => it.key.name === key)
        if (orginItem) {
          if(value.type === "ArrayExpression"){
            orginItem.value.elements = orginItem.value.elements.concat(value.elements)
          }else{
            orginItem.value.properties = orginItem.value.properties.concat(value.properties)
          }
        } else {
          orginAST.push(mixinItem)
        }
      }
    }
  })
  return recast.print(ast).code;
}

function addMixin(mixin) {
  mixinsList.push(mixin)
}

function mixinsAll(ast) {
  let code = false
  mixinsList.forEach(it => {
    code = mixins(ast, it)
  })
  return code
}

function replaceExport(ast, type) {
  recast.visit(ast, {
    visitExportDefaultDeclaration: function (path) {
      const node = path.node
      const rep = expressionStatement(callExpression(identifier(type), [node.declaration]))
      path.replace(rep)
      return false
    }
  })
}

module.exports = {
  mixins, mixinsAll, addMixin, replaceExport
}