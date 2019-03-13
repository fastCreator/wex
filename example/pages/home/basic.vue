<style>
view {
  border: 1px solid #fff;
}
</style>
<template>
  <view>
    <view>
      <input v-model="a" />
      <text>+</text>
      <input v-model="b" />
      {{c}}
    </view>
    <view click="a"></view>
    <view wx:if="{{length > 5}}">1</view>
    <view wx:for="{{array}}">
      {{index}}: {{item.message}}
    </view>
    <view
      wx:for="{{array}}"
      wx:for-index="idx"
      wx:for-item="itemName"
    >
      {{idx}}: {{itemName.message}}
    </view>
    <view>{{ message }}</view>
    <view>{{ message + 1 }}</view>
  </view>
</template>
<script>
export default {
  data: {
    a: 1,
    b: 0
  },
  lifetimes: {
    pullDown() {}
  },
  methods: {},
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
  }
};
</script>
<json>
  {
    "backgroundColor":"#eee",
    "usingComponents":{
      "w-input":"../../components/input.vue"
    }
  }
</json>
