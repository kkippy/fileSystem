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
            <p>{{ item.total }}</p>
          </div>
          <div class="right">
            <p>{{ item.today }}</p>
            <p>{{ item.todayCount }}</p>
          </div>
        </li>

        <li>
          <div class="pieChart" >
            <ECharts width="22" height="22" :option="pieOption" />
          </div>
        </li>

        <li v-for="(item) in dataItemOptions2"  :key="item.key">
          <div class="icon">
            <img :src="item.icon" alt="">
          </div>
          <div class="left">
            <p>{{ item.title }}</p>
            <p>{{ item.total }}</p>
          </div>
          <div class="right">
            <p>{{ item.today }}</p>
            <p>{{ item.todayCount }}</p>
          </div>
        </li>

      </ul>
    </div>
    <div class="centerContainer"></div>
    <div class="bottomContainer"></div>
  </div>

</template>

<script setup lang="ts">
import ECharts from "@/components/Echarts/index.vue";
import uploadCount from '@/assets/images/uploadCount.svg'
import downloadCount from '@/assets/images/downloadCount.svg'
import viewCount from '@/assets/images/viewCount.svg'
import groupCount from '@/assets/images/groupCount.svg'
import { ref, onMounted, onBeforeUnmount, nextTick, computed } from 'vue'
import {pieOption} from './config/option'
import {getTodayView,getTotalView,getTodayGroup,
  getCapacity,getTotalDownload,getTotalGroup,
  getTodayDownload,getTodayUpload,getTotalUpload
} from '@/api/home/index'


const todayViews = ref<number>()
const totalViews = ref<number>()
const todayDownloads = ref<number>()
const totalDownloads = ref<number>()
const todayUploads = ref<number>()
const totalUploads = ref<number>()
const todayGroups = ref<number>()
const totalGroups = ref<number>()
const totalCapacity = ref<number>()
const usedCapacity = ref<number>()


const dataItemOptions1 = computed(()=>[
  {
    key:'upload',
    icon: uploadCount,
    title: '上传量',
    total: totalUploads.value,
    today:'今日',
    todayCount:todayUploads.value,
  },
  {
    key:'view',
    icon: viewCount,
    title: '浏览量',
    total: totalViews.value,
    today:'今日',
    todayCount:todayViews.value,
  },
])

const dataItemOptions2 = computed(()=>[
  {
    key:'group',
    icon: groupCount,
    title: '群组数',
    total: totalGroups.value,
    today:'今日',
    todayCount:todayGroups.value,
  },
  {
    key:'download',
    icon: downloadCount,
    title: '下载量',
    total: totalDownloads.value,
    today:'今日',
    todayCount:todayDownloads.value,
  },
])

onMounted(()=>{
  getView()
  getTotalViewCount()
  getDownload()
  getTotalDownloadCount()
  getUpload()
  getTotalUploadCount()
  getGroup()
  getTotalGroupCount()
  getCapacityRatio()
  window.addEventListener('resize',handleResize)
})
onBeforeUnmount(()=>{
  window.removeEventListener('resize',handleResize)
})

const handleResize = ()=>{
  window.location.reload();
}

const getView = async ()=>{
  const { data } = await getTodayView()
  todayViews.value = data
}

const getTotalViewCount = async ()=>{
  const { data } = await getTotalView()
  totalViews.value = data
}

const getDownload = async ()=>{
  const { data } = await getTodayDownload()
  todayDownloads.value = data
}

const getTotalDownloadCount = async ()=>{
  const { data } = await getTotalDownload()
  totalDownloads.value = data
}

const getUpload = async ()=>{
  const { data } = await getTodayUpload()
  todayUploads.value = data
}

const getTotalUploadCount = async ()=>{
  const { data } = await getTotalUpload()
  totalUploads.value = data
}

const getGroup = async ()=>{
  const { data } = await getTodayGroup()
  todayGroups.value = data
}

const getTotalGroupCount = async ()=>{
  const { data } = await getTotalGroup()
  totalGroups.value = data
}





const getCapacityRatio = async ()=>{
  const { data } = await getCapacity()
  console.log(data,'data')
  totalCapacity.value = data.totalCapacity
  usedCapacity.value = data.usedCapacity
}

</script>

<style scoped lang="scss">
@media  (min-width: 1366px) {
  p{
    margin: 0;
    padding: 0;
  }

  .homeContainer {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    box-sizing: border-box;
    background-color: #f3f4fa;

    .centerContainer {
      height: 55%;
      background-color: skyblue;
    }

    .topContainer {
      height: 20%;
      display: flex;
      justify-content: center;
      flex-grow: 1;

      ul {
        width: 98%;
        display: flex;
        justify-content: space-between;
        align-items: flex-end;

        li {
          flex: 0 0 19%;
          height: 60%;
          display: flex;
          border-radius: 8px;
          //background-color: #f3f4fa;
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

          &:nth-child(1),&:nth-child(5){
            background-color: #b2daf9;
            .icon{
              background-color: #73AEF1;
            }
          }

          &:nth-child(2),&:nth-child(4){
            background-color:#faf2db;
            .icon{
              background-color: #f2e3c2;
            }
          }

          .left,.right{
            display: flex;
            flex-direction: column;
            flex:0 0 48%;
            padding-left: 10px;
            p:nth-child(1){
              font-size: 1.2vw;
            }
            p:nth-child(2){
              font-size: 1.2vw;
              font-weight: bold;
            }
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
      }
    }

    .bottomContainer {
      height: 20%;
    }
  }
}
</style>
