<template>
  <li class="liStyle" v-for="(item) in dataItemOptions1"  :key="item.key">
    <div class="icon">
      <img :src="item.icon" alt="">
    </div>
    <div class="left">
      <p>{{ item.title }}</p>
      <p>{{ item.count }}</p>
    </div>
    <div class="right">
      <p>{{ item.title }}</p>
      <p>{{ item.count }}</p>
    </div>
  </li>
</template>

<script setup lang="ts">
import { ref } from 'vue'
defineOptions({
  name: "dataItem"
})
interface DataItem {
  key: string;
  icon: any; // 根据实际情况调整类型
  title: string;
  count: string;
}
const props = defineProps({
  option:{
    type: Array as () => DataItem[],
    required: true,
  },
})

const dataItemOptions1 = ref(props.option)

</script>

<style scoped lang="scss">
.liStyle {
  flex: 0 0 19%;
  height: 60%;
  display: flex;
  border-radius: 8px;
  background-color: #fff;
  position: relative;
  justify-content: space-between;
  align-items: self-end;

  &:nth-child(3) {
    width: 100%;
    height: 100%;
    background-color: transparent;
    display: flex;
    align-items: center;
    justify-content: center;

    .pieChart {
      display: flex;
      width: 16vw;
      height: 16vh;
      align-items: center;
      justify-content: center;

    }
  }


  &:nth-child(1) .icon,
  &:nth-child(5) .icon {
    background-color: #73AEF1;
  }

  &:nth-child(2) .icon,
  &:nth-child(4) .icon {
    background-color: #ffeaaf;
  }


  .left,.right{
    display: flex;
    flex-direction: column;
    flex:0 0 48%;
    p:nth-child(1){
      font-size: 1.2vw;
    }
    p:nth-child(2){
      font-size: 1.2vw;
      font-weight: bold;
    }
  }

  .left{
    padding-left: 10px;
  }

  .right {
    padding-right: 10px;
  }

  .icon {
    width: 4vw;
    height: 4vw;
    flex-grow: 1;
    position: absolute;
    top: -2vw;
    left: 1.2vw;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 8px;

    img {
      margin: 0 auto;
      height: 92%;
      object-fit: cover;
    }

  }
}
</style>
