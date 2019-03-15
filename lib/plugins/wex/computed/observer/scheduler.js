let observer = require('./observer')
const queue = {}
let runing = false

function queueUpdate(path, v) {
  queue[path] = this.$attrs
  update()
}

function update() {
  if (!runing) {
    runing = true
    wx.nextTick(() => {
      observer.stopSet = true
      //排序防止覆盖 
      this.setData(queue)
      observer.stopSet = false
      queue = {}
      runing = false
    })
  }
}