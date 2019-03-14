
const computedBehavior = require('../../../wexLib/computed.js')

Component({
  data: {
    a: 1,
    b: 0,
    list:['一','二','三']
  },

  lifetimes: {
    pullDown() {}
  },

  methods: {
    a() {
      console.log("点击事件触发");
    },

    _eventEmit(e,...arg) {
      let event = e.type
      let dataset = e.currentTarget.dataset
      let modefys = dataset["wexModefys"+event].split(',')
      let method = dataset["wexMethod" + event]
      let count = dataset["wexId"]
      if(modefys.includes('self') && JSON.stringify(e.currentTarget) !== JSON.stringify(e.target)){
        return false
      }
      if(modefys.includes('once') && this['_wex_'+event+count]){
        return false
      }
      this['_wex_'+event+count] = true
      this[method](e,...arg)
    },

    onPullDownRefresh() {
      console.log(this.data.b);
    }
  },

  watch: {},

  computed: {
    c() {
      return this.data.a + this.data.b;
    }
  },

  pageEvents: {
    onPullDownRefresh() {
      console.log(this.data.b);
    }
  },

  behaviors:[computedBehavior]
});
