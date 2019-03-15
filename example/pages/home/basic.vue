<style>
.wrap {
  border: 1px solid #eee;
  margin: 20rpx;
  padding: 20rpx;
}
.title {
  font-size: 50rpx;
}
input {
  display: inline-block;
  width: 200rpx;
  border: 1px solid #dcdfe6;
  border-radius: 10rpx;
  margin-top: 20rpx;
}
</style>
<template>
  <view>
    <view class="wrap">
      <view class="title">v-model</view>
      <input v-model="a" />
      <text>+</text>
      <input v-model="obj.a" />
      <text>=</text>
      <text>{{a+obj.a}}</text>
    </view>
    <view class="wrap">
      <view class="title">计算属性</view>
      <view>a + 1 = {{c1}}</view>
      <view>obj.a + 1 = {{c2}}</view>
    </view>
    <view class="wrap">
      <view class="title">注释</view>
      <!-- <text>表达式</text> -->
    </view>
    <view class="wrap">
      <view class="title">事件处理</view>
      <view @click="a"><text>内层</text>click</view>
      <view @click.once="a"><text>内层</text>click.once</view>
      <view @click.self="a"><text>内层</text>click.self</view>
      <view @click.capture.stop="a"><text>内层</text>click.capture.stop</view>
      <view @click.capture.once="a"><text>内层</text>click.capture.once</view>
      <view @click.capture="a"><text>内层</text>click.capture</view>
    </view>
    <view class="wrap">
      <view class="title">ifElse</view>
      <view v-if="true">v-if</view>
      <view v-else-if="true">v-else-if</view>
      <view v-else>v-else</view>
    </view>
    <view class="wrap">
      <view class="title">showHidden</view>
      <view v-show="true">v-show</view>
      <view v-hidden="false">v-hidden</view>
    </view>
    <view class="wrap">
      <view class="title">循环</view>
      <view
        v-for="(it,i) in list"
        :key="i"
      >
        {{it}}-{{i}}
        <input v-model="list[i]" />
        <input v-model="it" />
      </view>
    </view>
    <view class="wrap">
      <view class="title">监听变化</view>
      <input v-model="watch" />{{watch}}
    </view>
  </view>
</template>
<script>
export default {
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
