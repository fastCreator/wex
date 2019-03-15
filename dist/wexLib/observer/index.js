const observer = require('./observer.js')
const Watch = require('./watcher.js')
const scheduler = require('./scheduler.js')
module.exports = Behavior({
  lifetimes: {
    created() {
      this.data = observer(this.data)
      scheduler.queueUpdate.setData = this.setData.bind(this)
      this.initComputed(this)
    }
  },
  definitionFilter(defFields) {
    const computed = defFields.computed || {}
    defFields.methods = defFields.methods || {}
    defFields.methods.initComputed = function (vm) {
      Object.keys(computed).forEach(key => {
        new Watch(vm, key, computed[key])
      })
    }
  }
})