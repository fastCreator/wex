
const fs = require("fs-extra");
const gulp = require("gulp");
const path = require("path");
const printUtils = require("./print");
const pathUtils = require("./path")

let watchs = {}
let fsUtils = {
  readFile(filePath) {
    return fs.readFile(filePath, 'utf-8').catch(err => { printUtils.printError('读取文件出错', filePath, err) })
  },
  writeFile(filePath, data) {
    if (data && data !== 'false') {
      return fs.outputFile(filePath, data).catch(err => { printUtils.printError('写入文件失败', filePath, err) })
    } else {
      return Promise.resolve()
    }
  },
  remove(filePath) {
    return fs.remove(filePath).catch(err => { printUtils.printError('删除文件失败', filePath, err) })
  },
  removeSync(filePath) {
    try {
      fs.removeSync(filePath)
    } catch (error) {
      printUtils.printError('删除文件失败', filePath, err)
    }
  },
  copy(from, to) {
    return fs.copy(from, to).catch(err => { printUtils.printError('复制文件失败', from, '=>', to, err) })
  },
  mkdirs(dirpath) {
    return fs.ensureDir(dirpath).catch(err => { printUtils.printError('目录创建失败', dirpath, err) })
  },
  existsSync(dirPath) {
    return fs.pathExistsSync(dirPath)
  },
  filesync(dirs, config) {
    let watchs = {}
    dirs.forEach(dirPath => {
      fsUtils.copy(pathUtils.getAbsolutePath(dirPath, config), pathUtils.getOutputPath(dirPath, config))
      let absdirPath = pathUtils.getAbsolutePath(dirPath, config)
      if (fsUtils.existsSync(absdirPath)) {
        let w = gulp.watch(absdirPath)
        watchs[dirPath] = w
        w.on('add', (filePath) => {
          fsUtils.copy(filePath, pathUtils.getOutputPath(filePath, config))
        })
        w.on('change', (filePath) => {
          let src = pathUtils.getOutputPath(filePath, config)
          gulp.src(filePath).pipe(gulp.dest(path.dirname(src)))
        })
        w.on('unlink', (filePath) => {
          fsUtils.remove(pathUtils.getOutputPath(filePath, config))
        })
      } else {
        printUtils.printError('同步文件不存在:', absdirPath)
      }
    })
    return {
      unwatch() {
        for (let key in watchs) {
          fsUtils.remove(pathUtils.getOutputPath(key, config))
          watchs[key].unwatch()
        }
      }
    }
  }
}

module.exports = fsUtils