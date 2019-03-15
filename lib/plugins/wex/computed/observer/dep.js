const dep = {
  target:null,
  deps:{},
  pushTarget(watch){
    this.target = watch
    this.deps.length=0
  },
  popTarget(){
    this.target = null
  },
  notify(path){
    let updates = this.deps[path]
    updates&&updates.forEach(watch=>{
      watch.update()
    })
  },
  depend(path){
    if(this.target){
      if(this.deps[path]){
        this.deps.add(this.target)
      }else{
        this.deps = new Set([this.target])
      }
    }
  }
}