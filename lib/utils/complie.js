const path = require('path')
const compiler = require('vue-template-compiler')
const fsUtils = require("./fs")
const pathUtils = require("./path")
const printUtils = require("./print");

var complieUtils = {
  compiler(contents) {
    let rsf = compiler.parseComponent(contents, { pad: 'line' });
    let json = rsf.customBlocks.find(it => it.type === 'json')
    if (json) {
      try {
        rsf.json = eval(`(${json.content})`)
      } catch (error) {
        printUtils.printError('json解析异常', json.content)
      }
    }
    if(rsf.script){
      rsf.script.content = rsf.script.content.replace(/\/\/\n/g, '')
    }
    return rsf
  },
  getrsf(filePath) {
    return fsUtils.readFile(filePath).then(content => {
      return complieUtils.compiler(content)
    })
  },
  delCompliePath(filePath, config) {
    let complilePath = complieUtils.getWexcompliePath(filePath, config)
    fsUtils.removeSync(complilePath.style)
    fsUtils.removeSync(complilePath.script)
    fsUtils.removeSync(complilePath.json)
    fsUtils.removeSync(complilePath.template)
  },
  getWexcompliePath(filePath, config, relative) {
    let relativePath = pathUtils.getOutputPath(filePath, config).replace(config.extname, '')
    if (relative) {
      relativePath = path.resolve(relativePath, relative)
    }
    return {
      style: relativePath + '.wxss',
      script: relativePath + '.js',
      json: relativePath + '.json',
      template: relativePath + '.wxml',
    }
  },
  copyCompliePath(filePath, config) {
    const extnames = ['.wxss', '.js', '.json', '.wxml']
    let relativePath = pathUtils.getOutputPath(filePath, config).replace(config.extname, '')
    for (let i = 0; i < extnames.length; i++) {
      let inputPath = filePath + extnames[i]
      if (fsUtils.existsSync(inputPath)) {
        fsUtils.copy(inputPath, relativePath + extnames[i])
      }
    }
  },
  deepClone(json) {
    return JSON.parse(JSON.stringify(json))
  },
  getJSONExtname(sfc) {
    let json = sfc.json
    if (!json) {
      return false
    }
    json = complieUtils.deepClone(json)
    if (json.pages) {
      json.pages = json.pages.map(it => pathUtils.excludeExtname(it))
    }
    if (json.usingComponents) {
      for (let key in json.usingComponents) {
        json.usingComponents[key] = pathUtils.excludeExtname(json.usingComponents[key])
      }
    }
    return json
  }
}

module.exports = complieUtils
