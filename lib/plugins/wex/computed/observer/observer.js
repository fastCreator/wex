const dep = require('./dep')

module.exports = observe

function observe(target,path = ''){
  return new Proxy(target,{
    get(target, key, receiver = ''){
      dep.depend(path)
      if(typeof(target[key])==='object'){
        return observe(target[key],path+key)
      }else{
        return Reflect.get(target, key, receiver);
      }
    },
    set(target, key, value, receiver){
      dep.notify(path);
      return Reflect.set(target, key, value, receiver);
    }
  })
}
