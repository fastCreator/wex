<style lang="scss">
@import "./index.scss";
</style>


<script>
const a = 123
export default {
  onLaunch() {},
  globalData: {}
};
</script>
<json>
  {
    "pages": [
      "pages/home/basic.vue",
      "pages/home/native/index"
    ],
    "usingComponents":{
      // "w-input":"components/input.vue"
    },
    "window": {
      "navigationBarBackgroundColor": "#39b54a",
      "navigationBarTitleText": "wepy UI",
      "navigationStyle": "custom",
      "navigationBarTextStyle": "white",
      "enablePullDownRefresh":true
    }
  }
</json>