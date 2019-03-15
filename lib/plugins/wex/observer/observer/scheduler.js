let queue = {}
let runing = false

module.exports ={
  queueUpdate
}

function queueUpdate(path, v) {
  queue[path.replace(/\.(\d+)\.?/g,'[$1]')] = v
  update()
}

function update() {
  if (!runing) {
    runing = true
    wx.nextTick(function() {
      queueUpdate.setData(queue)
      queue = {}
      runing = false
    })
  }
}