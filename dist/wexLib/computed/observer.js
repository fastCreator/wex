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


var data = {a:{b:{c:[1,2,3]}}}
var path = ''
var d = buildProxy(data,'')

function buildProxy(target,path){
  // target._path = path
  return new Proxy(target,{
    get(target, key, receiver = ''){
      if(typeof(target[key])==='object'){
        return buildProxy(target[key],path+key)
      }else{
        return Reflect.get(target, key, receiver);
      }
    },
    set(target, key, value, receiver){
      console.log('key',path)
      return Reflect.set(target, key, value, receiver);
    }
  })
}



console.log(d.a.b)
console.log(d.a.b.c)
console.log(d.a.b ={c:2})
console.log(d.a.b.c)