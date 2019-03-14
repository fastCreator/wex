<style>
view {
  border: 1px solid #fff;
}
</style>
<template>
  <view>
    <view>
      <text>v-model</text>
      <input
        data-model-key="a"
        bindinput="_modelInput"
        value="{{a}}"
      />
      <text>+</text>
      <input
        data-model-key="b"
        bindinput="_modelInput"
        value="{{b}}"
      />
      <text>计算属性{{c}}</text>
    </view>
    <view>
      <text>表达式</text>
    </view>
    <view>
      <text>事件处理</text>
      <view @click="a"><text>内层</text>click</view>
      <view @click.once="a"><text>内层</text>click.once</view>
      <view @click.self="a"><text>内层</text>click.self</view>
      <view @click.capture.stop="a"><text>内层</text>click.capture.stop</view>
      <view @click.capture.once="a"><text>内层</text>click.capture.once</view>
      <view @click.capture="a"><text>内层</text>click.capture</view>
    </view>
    <view>
      <text>ifElse</text>
      <view v-if="true">v-if</view>
      <view v-else-if="true">v-else-if</view>
      <view v-else>v-else</view>
    </view>
    <view>
      <text>showHidden</text>
      <view v-show="true">v-show</view>
      <view v-hidden="false">v-hidden</view>
    </view>
    <view>
      <text>循环</text>
      <view v-for="(it,i) in list" :key="i">{{it}}-{{i}}</view>
    </view>
  </view>
</template>
<script>
export default {
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
