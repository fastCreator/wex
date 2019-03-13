
const computedBehavior = require('../../../wexLib/computed.js')

Component({
  data: {
    a: 1,
    b: 0
  },

  lifetimes: {
    pullDown() {}
  },

  methods: {
    _modelInput(e) {
      let o = {}
      o[e.currentTarget.dataset.modelKey] = e.detail.value
      this.setData(o)
    },

    onPullDownRefresh(){
      console.log(this.data.b)
    }
  },

  watch: {},

  computed: {
    c() {
      return this.data.a + this.data.b;
    }
  },

  pageEvents:{
    onPullDownRefresh(){
      console.log(this.data.b)
    }
  },

  behaviors:[computedBehavior]
});
