const path = require('path')
module.exports = {
  getAbsolutePath(filePath, config) {
    if (path.isAbsolute(filePath)) {
      return filePath
    } else if (config) {
      return path.resolve(config.enter, filePath)
    } else {
      return path.resolve(process.cwd(), filePath)
    }
  },
  getOutputPath(inputPath, config) {
    let relativePath = inputPath
    if (path.isAbsolute(inputPath)) {
      relativePath = path.relative(config.enter, inputPath)
    }
    return path.resolve(config.output, relativePath)
  },
  excludeExtname(filePath) {
    return filePath.replace(path.extname(filePath), '')
  }
}