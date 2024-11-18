<template>
  <div class="homeContainer">
    <div class="topContainer">
      <ul>
        <li v-for="(item) in dataItemOptions1"  :key="item.key">
          <div class="icon">
            <img :src="item.icon" alt="">
          </div>
          <div class="left">
            <p>{{ item.title }}</p>
            <p>{{ item.count }}</p>
          </div>
          <div class="right">
            <div class="chart">
              <VueDataUi
                component="VueUiSparkline"
                :dataset="dataset"
                :config="config"
              />
            </div>
          </div>
        </li>
<!--        <data-item v-bind="$attrs" :config="config" :dataset="dataset" :option="dataItemOptions1" />-->

        <li>
          <h2>特殊盒子</h2>
        </li>

        <li v-for="(item) in dataItemOptions2"  :key="item.key">
          <div class="icon">
            <img :src="item.icon" alt="">
          </div>
          <div class="left">
            <p>{{ item.title }}</p>
            <p>{{ item.count }}</p>
          </div>
          <div class="right">
            <div class="chart">
              <VueDataUi
                component="VueUiSparkline"
                :dataset="dataset"
                :config="config"
              />
            </div>
          </div>
        </li>

      </ul>
    </div>
    <div class="centerContainer"></div>
    <div class="bottomContainer"></div>
  </div>

</template>

<script setup lang="ts">
import uploadCount from '@/assets/images/uploadCount.svg'
import downloadCount from '@/assets/images/downloadCount.svg'
import viewCount from '@/assets/images/viewCount.svg'
import groupCount from '@/assets/images/groupCount.svg'
import dataItem from "./components/dataItem.vue"
import { ref } from "vue";
import { VueDataUi, } from "vue-data-ui";
import type {VueUiSparklineConfig,VueUiSparklineDatasetItem}  from "vue-data-ui";
import "vue-data-ui/style.css";

interface DataItem {
  key: string;
  icon: any; // 根据实际情况调整类型
  title: string;
  count: string;
}

const dataItemOptions1 = ref<DataItem[]>([
  {
    key:'upload',
    icon: uploadCount,
    title: '上传量',
    count: '500',
  },
  {
    key:'view',
    icon: viewCount,
    title: '浏览量',
    count: '930',
  },
])

const dataItemOptions2 = ref<DataItem[]>([
  {
    key:'group',
    icon: groupCount,
    title: '分组数',
    count: '592',
  },
  {
    key:'download',
    icon: downloadCount,
    title: '下载量',
    count: '400',
  },
])

const dataset = ref<VueUiSparklineDatasetItem[]>([
  {
    "period": "period 1",
    "value": 8,
  },
  {
    "period": "period 2",
    "value": 12
  },
  {
    "period": "period 3",
    "value": 30
  },
  {
    "period": "period 4",
    "value": 22
  },
  {
    "period": "period 5",
    "value": 9
  },
  {
    "period": "period 6",
    "value": 12
  },
  {
    "period": "period 6",
    "value": 33
  },

]);
const config = ref<VueUiSparklineConfig>({
  responsive: true,
  type: "line",
  style: {
    backgroundColor: "#FFFFFF",
    animation: {
      show: true,
      animationFrames: 300
    },
    area: {
      color: "#5f8bee",
    },
    line: {
      smooth: true,
      color: "#5f8bee"
    },
    dataLabel: {
      show: true,
      position:'left',
      offsetX:80,
      offsetY: -15,
      bold: true,
      valueType:'average',
    },
    title: {
      show: true,
      textAlign:'center',
      bold:true
    },
    zeroLine: {
      color: "#CCCCCC"
    }
  }
});


</script>

<style scoped lang="scss">
@media  (min-width: 1366px) {
  p{
    margin: 0;
    padding: 0;
  }

  .homeContainer {
    height: 100%;
    border: 1px solid #13ce66;
    display: flex;
    flex-direction: column;
    justify-content: space-between;


    .topContainer, .bottomContainer {
      background-color: red;
    }

    .centerContainer {
      height: 55%;
      background-color: skyblue;
    }

    .topContainer {
      height: 20%;
      display: flex;
      flex-grow: 1;


      ul {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: flex-end;

        li {
          flex: 0 0 19%;
          height: 60%;
          display: flex;
          border-radius: 8px;
          background-color: #fff;
          position: relative;
          justify-content: space-between;
          align-items: self-end;

          &:nth-child(3) {
            height: 100%;
            background-color: orchid;
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
            //height: 60%;
            //background-color: #34495e;
          }

          .left{
            width: 28%;
            padding-left: 10px;
            p:nth-child(1){
              font-size: 1.25rem;
            }
            p:nth-child(2){
              font-size: 1.5rem;
              font-weight: bold;
            }
          }

          .right {
            width: 70%;

            .chart{
              width: 100%;
            }

          }

          .icon {
            width: 65px;
            height: 65px;
            flex-grow: 1;
            position: absolute;
            top: -30%;
            left: 10%;
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
      }
    }

    .bottomContainer {
      height: 20%;
    }
  }
}
</style>
