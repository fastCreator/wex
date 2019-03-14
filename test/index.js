let complile = require('../index.js')
let filesync = require('../lib/plugins/filesync-plugin')
let less = require('../lib/plugins/less-loader.js')
let scss = require('../lib/plugins/scss-loader.js')
let wex = require('../lib/plugins/wex')
let resolve = (src) => require('path').resolve(__dirname, src)

complile({
  enter: resolve('../example'),//入口文件必须存在App.vue
  output: resolve('../dist'),
  plugins: [filesync(['image', 'css']), less(), scss(), wex()]
})