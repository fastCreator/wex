const path = require('path')
const gulp = require('gulp')
const utils = require('../utils')
const compile = require('./compile')
const pluginLoader = require('./plugin-loader')

class WatcherControl {
  constructor() {
    this.data = {}
  }
  add(filePath, buildWatch) {
    if (this.data[filePath]) {
      this.data[filePath].count++
    } else {
      let watch = buildWatch()
      utils.printSuccess('新增编译文件:' + filePath)
      watch.watch()
      this.data[filePath] = {
        count: 1,
        watch: watch
      }
    }
  }
  remove(filePath) {
    let o = this.data[filePath]
    if (o.count === 1) {
      utils.printSuccess('删除编译文件:' + filePath)
      o.watch.unwatch()
      this.data[filePath].count = 0
      delete (this.data[filePath])
    } else {
      o.count--
    }
  }
}

let wc = new WatcherControl()

module.exports = async function (config) {
  await pluginLoader.hookPlugin('before', config)
  await build(config.enterFile, config, 'app')
  await pluginLoader.hookPlugin('end', config)
}

async function build(file, config, type) {
  if (path.extname(file) === config.extname) {
    wc.add(file, function () {
      return new WexWatch(file, config, type)
    })
  } else {
    if (utils.existsSync(file + '.wxml')) {
      wc.add(file, function () {
        return new NativeWatch(file, config)
      })
    } else {
      utils.printError('不存在:', file + '.wxml')
    }
  }
}

class WexWatch {
  constructor(filePath, config, type) {
    this.filePath = filePath
    this.config = config
    this.oldlist = []
    this.newlist = []
    this.type = type
  }
  watch() {
    this.w = gulp.watch(this.filePath);
    this.deal()
    this.w.on('change', () => {
      this.deal()
    })
    this.w.on('unlink', () => {
      watcher.remove(this.filePath)
      this.oldlist.forEach(it => {
        watcher.remove(it)
      })
    })
  }
  unwatch() {
    this.w.unwatch()
    utils.delCompliePath(this.filePath, this.config)
  }
  async deal() {
    let rsf = await compile(this.filePath, this.config, this.type)
    if (rsf) {
      let list = getWatcherList(this.filePath, rsf)
      this.newlist = list.pages.concat(list.components)
      let { del, add } = compareonarr(this.oldlist, this.newlist)
      this.oldlist = this.newlist
      for (let i = 0; i < add.length; i++) {
        if (list.pages.includes(add[i])) {
          await build(add[i], this.config, 'page')
        } else {
          await build(add[i], this.config, 'component')
        }

      }
      for (let i = 0; i < del.length; i++) {
        await wc.remove(del[i])
      }
    }
  }
}

class NativeWatch {
  constructor(filePath, config) {
    this.filePath = filePath
    this.config = config
  }
  watch() {
    utils.copyCompliePath(this.filePath, this.config)
    let dirname = path.dirname(this.filePath)
    const matchs = [this.filePath + '.js', this.filePath + '.json', this.filePath + '.wxss', this.filePath + '.wxml']
    this.w = gulp.watch(dirname)
    this.w.on('change', (filePath) => {
      if (matchs.includes(filePath)) {
        let src = utils.getOutputPath(filePath, this.config)
        gulp.src(filePath).pipe(gulp.dest(path.dirname(src)))
      }
    })
    this.w.on('add', (filePath) => {
      if (matchs.includes(filePath)) {
        utils.copy(filePath, utils.getOutputPath(filePath, this.config))
      }
    })
    this.w.on('unlink', (filePath) => {
      utils.remove(utils.getOutputPath(filePath, this.config))
    })
  }
  unwatch() {
    this.w.unwatch()
    utils.delCompliePath(this.filePath, this.config)
  }
}


function getWatcherList(basePath, rsf) {
  basePath = path.dirname(basePath)
  let list = {
    pages: [],
    components: []
  }
  let json = rsf.json
  if (json) {
    if (json.pages) {
      json.pages.forEach(it => {
        list.pages.push(path.resolve(basePath, it))
      })
    }
    if (json.usingComponents) {
      for (let key in json.usingComponents) {
        let it = json.usingComponents[key]
        list.components.push(path.resolve(basePath, it))
      }
    }
  }
  return list
}

function compareonarr(arr1, arr2) {
  arr1 = Object.assign([], arr1)
  arr2 = Object.assign([], arr2)
  for (let i = 0; i < arr1.length; i++) {
    let it = arr1[i]
    let j = arr2.indexOf(it)
    if (~j) {
      arr1.splice(i, 1)
      arr2.splice(j, 1)
      i--
    }
  }
  return {
    del: arr1,
    add: arr2
  }
}


