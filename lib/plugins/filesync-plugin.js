module.exports = (option) => {
  let dirs = option
  return {
    before(utils, config) {
      utils.filesync(dirs, config)
    }
  }
}
