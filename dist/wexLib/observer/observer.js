const dep = require('./dep.js')
const scheduler = require('./scheduler.js')
module.exports = observe

function observe(target, path = '') {
  return new Proxy(target, {
    get(target, key, receiver = '') {
      let name = `${path}.${key}`
      dep.depend(name)
      if (typeof (target[key]) === 'object') {
        return observe(target[key], name)
      } else {
        return Reflect.get(target, key, receiver);
      }
    },
    set(target, key, value, receiver) {
        let name = `${path}.${key}`
        let c = Reflect.set(target, key, value, receiver);
        scheduler.queueUpdate(name, value)
        dep.notify(name);
        return c
    }
  })
}
