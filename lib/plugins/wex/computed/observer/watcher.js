const dep = require('./dep')
const scheduler = require('./scheduler')
export default class Watcher {
  constructor(vm, fn, path) {
    this.deps = []
    this.fn = fn
    this.vm = vm
    this.path = path
    dep.pushTarget(this)
    this.cache = this.fn.call(this.vm)
    dep.popTarget()
  }
  update() {
    let nv = fn.call(vm)
    if (nv !== this.cache) {
      scheduler.queueUpdate(this.path,nv)
    }
    this.cache = nv
  }
}