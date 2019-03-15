
const observerBehavior = require('../../../wexLib/observer.js')
const computedBehavior = require('../../../wexLib/computed.js')

Component({
  properties:{
    propp:{
      type:Number
    }
  },
  data: {
    a: 1,
    b: 0,
    list: ["一", "二", "三"],
    count: 111111111,
    obj: { count: 1 }
  },

  lifetimes: {
    created() {
      console.log(this)
      setTimeout(() => {
        console.log('------------------')
        this.data.count = 2222222
        console.log(this.data.count)
        this.data.obj.count = 44444444444
        this.setData({})
        // this.data.a = 3
      }, 1000);
      // console.log(this.data);
    }
  },

  methods: {
    a() {
      console.log("点击事件触发");
    },

    _modelInput(e) {
      let o = {}
      o[e.currentTarget.dataset.modelKey] = e.detail.value
      this.setData(o)
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
      console.log('computed')
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
