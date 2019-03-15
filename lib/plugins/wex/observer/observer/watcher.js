const dep = require('./dep.js')
const scheduler = require('./scheduler.js')
module.exports = class Watcher {
  constructor(vm, path, fn) {
    this.deps = []
    this.fn = fn
    this.vm = vm
    this.path = path
    dep.pushTarget(this)
    this.update()
    dep.popTarget()
  }
  update() {
    let nv = this.fn.call(this.vm)
    if (nv !== this.cache) {
      this.vm.data[this.path] = nv
      scheduler.queueUpdate(this.path, nv)
    }
    this.cache = nv
  }
}