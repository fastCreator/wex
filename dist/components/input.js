
const observerBehavior = require('../wexLib/observer.js')
const computedBehavior = require('../wexLib/computed.js')

Component({
  data: {},

  lifetimes: {
    pullDown() {}
  },

  methods: {},
  watch: {},
  compoted: {},
  behaviors:[computedBehavior, observerBehavior]
});
