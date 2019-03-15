const observer = require('./observer')
const Watch = require('./watcher')
module.exports = Behavior({
  lifetimes: {
    created() {
      observer(this.data)
    }
  },
  definitionFilter(defFields) {
    const computed = defFields.computed || {}
    Object.keys(computed).forEach(key => {
      new Watch(key, computed[key], key)
    })
  }
})