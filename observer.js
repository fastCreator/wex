var data = {a:{b:{c:[1,2,3]}}}
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
      console.log('key',path+key)
      return Reflect.set(target, key, value, receiver);
    }
  })
}

for(let i=0;i<100000;i++){
  d.a.b ={x:5}
}