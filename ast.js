
let code = `
const computedBehavior = require('miniprogram-computed')
export default {
  data: {},
  lifetimes: {
    pullDown() {}
  },
  methods: {},
  watch: {},
  compoted: {}
};
`
let res = `
Page({
  data: {},
  lifetimes: {
    pullDown() {}
  },
  methods: {},
  watch: {},
  compoted: {}
});
`
var recast = require("recast");
let ast = recast.parse(code)
let a = recast.parse(res)
var builders = recast.types.builders;
const { expressionStatement, callExpression,identifier,variableDeclaration,literal,variableDeclarator } = builders
// builders.ExpressionStatement()
// builders.callExpression
//ast.program.body[0].declaration.properties

// ast.program.body.unshift(variableDeclaration('const',[variableDeclarator('computedBehavior',callExpression(identifier('require'), [literal('miniprogram-computed')]))]))

recast.visit(ast, {
  visitExportDefaultDeclaration: function (path) {
    const node = path.node
    const rep = expressionStatement(callExpression(identifier('Page'), [node.declaration]))
    path.replace(rep)
    return false
  }
})


console.log(recast.print(ast).code)

console.log('end')