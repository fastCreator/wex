let observer = require('./observer')
module.exports = Behavior({
  lifetimes: {
    created() {
      observer.observe(this, this.data)
    }
  },
})