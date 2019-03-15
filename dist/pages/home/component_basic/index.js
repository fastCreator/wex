
const observerdBehavior = require('../../../wexLib/observer/index.js')

Component({
  data: {
    a: 1,
    b: 0,
    list: ["一", "二", "三"],
    count: 111111111,
    obj: { count: 1, a: 333 }
  },

  lifetimes: {
    created() {
      setTimeout(() => {
        console.log("------------------");

        this.data.obj = { a: 11111 };
        this.data.obj.a = 222222222;
        this.data.a = 3;
      }, 1000);
      console.log(this.data);
    }
  },

  methods: {
    a() {
      console.log("点击事件触发");
    },

    _modelInput(e) {
      let o = this.data
      let arr = e.currentTarget.dataset.modelKey.split('.')
      for(let i = 0;i<arr.length - 1;i++){
        o = o[arr[i]]
      }
      o[arr[arr.length-1]] = e.detail.value
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
    },
    x() {
      return this.data.a +this.data.obj.a;
    }
  },

  pageEvents: {
    onPullDownRefresh() {
      console.log(this.data.b);
    }
  },

  behaviors:[observerdBehavior]
});
