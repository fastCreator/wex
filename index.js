const gulp = require('gulp')
const path = require('path')
const utils = require('./lib/utils')
const build = require('./lib/core/index')
const pluginLoader = require('./lib/core/plugin-loader')

let defaultConfig = {
  extname: '.vue'
}

module.exports = async function (config) {
  config = dealConfig(config)
  await utils.remove(config.output)
  await utils.mkdirs(config.output)
  dealPlugins(config)
  build(config)
}

function dealPlugins(config) {
  pluginLoader.registerPlugin(config.plugins)
}

function dealConfig(c) {
  c = Object.assign(defaultConfig, c)
  c.enter = utils.getAbsolutePath(c.enter)
  c.output = utils.getAbsolutePath(c.output)
  c.enterFile = path.resolve(c.enter, `app${c.extname}`)
  return c
}

