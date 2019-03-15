
const observerdBehavior = require('../../../wexLib/observer/index.js')

Component({
  data: {
    a: 1,
    b: 0,
    list: ["一", "二", "三"],
    count: 111111111,
    obj: { count: 1, a: 333 },
    watch: 123
  },

  observers: {
    "watch":function(v) {
      console.log(`监听到变化:${v}`);
    }
  },

  lifetimes: {
    created() {
      console.log(this)
      setTimeout(() => {
        // console.log("------------------");
        // this.data.list[1] = 2;
        // console.log(this);
        // this.data.obj = { a: 11111 };
        // this.data.obj.a = 222222222;
        // this.data.a = 3;
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
      let dataset = e.currentTarget.dataset
      if(dataset.forIndexName){
        let name = dataset.forIndexName
        let value = dataset.forIndexValue
        let item = dataset.forIndexItem
        let list = dataset.forIndexList
        dataset.modelKey = dataset.modelKey.replace(new RegExp('^'+item+'($|[\.\[])'),list+'['+value+']'+'$1')
        dataset.modelKey = dataset.modelKey.replace(new RegExp('\\[\s*'+name+'\s*\\]'),'['+value+']')
      }
      let arr = dataset.modelKey.split('.')
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
    c1() {
      return this.data.a + 1;
    },
    c2() {
      return this.data.obj.a + 1;
    }
  },

  behaviors:[observerdBehavior]
});
