function defineReactive(vm, obj, key, path) {
  let val = obj[key];
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get: function reactiveGetter() {
      console.log('get',path)
      return val
    },
    set: function reactiveSetter(newVal) {
      console.log(123123)
      val = newVal
      // vm.setData({[path.slice(1)]:val});
    }
  });
}

function observe(vm, obj, path = '') {
  for (let key in obj) {
    let it = obj[key]
    let p = path + `.${key}`
    if (typeof (it) === 'object' && !Array.isArray(it)) {
      observe(vm, it, p)
    }
    defineReactive(vm, obj, key, p)
  }
}
module.exports = {
  observe
}