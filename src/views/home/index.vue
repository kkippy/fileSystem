<template>
  <div class="homeContainer">
    <div class="topContainer">
      <ul>
        <li v-for="(item) in dataItemOptions"  :key="item.key">
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
    <div class="centerContainer">
      <div class="lineChart" id="lineChart">
      </div>
      <div class="barChart" id="barChart"></div>
    </div>
    <div class="bottomContainer" v-loading="scrollTableLoading">
      <el-table
        style="width: 100%"
        class="top"
        height="25"
        :row-class-name="tableRowClassName"
        :header-cell-style="{background:'#fff',color:'#909399',padding: '0'}"
        :header-row-style="{height: '13'}"
      >
        <el-table-column prop="department" label="科室"  align="center" />
        <el-table-column prop="fileCount" label="文件数量" min-width="150" align="center" />
        <el-table-column prop="linkCount" label="链接数量" min-width="105"  align="center" />
        <el-table-column prop="usedCapacity" label="使用容量" min-width="105"  align="center" />
      </el-table>
      <vue3-seamless-scroll
        :list="list"
        :hover="true"
        style="width:auto;"
        :step="0.3"
        :singleWaitTime="30"
      >
        <scroll-table class="bottom" :list="list" />
      </vue3-seamless-scroll>
    </div>
  </div>

</template>

<script setup lang="ts">
import uploadCount from '@/assets/images/uploadCount.svg'
import downloadCount from '@/assets/images/downloadCount.svg'
import viewCount from '@/assets/images/viewCount.svg'
import groupCount from '@/assets/images/groupCount.svg'
import capacity from '@/assets/images/capacity.svg'
import { ref, onMounted, onBeforeUnmount, computed } from 'vue'
import {
  getTodayView, getTotalView, getTodayGroup, getTotalDownload, getTotalGroup,
  getTodayDownload, getTodayUpload, getTotalUpload, getCapacity, getScrollList, getLineChart, getBarChart
} from '@/api/home'
import  {createDataItem,departmentMap,barOption} from "./config/option"
import { Vue3SeamlessScroll  } from 'vue3-seamless-scroll'
import  type {getScrollItem} from "@/api/home/type"
import * as echarts from 'echarts';
type EChartsOption = echarts.EChartsOption;
import scrollTable from "./components/scrollTable.vue"

const todayViews = ref<number>()
const totalViews = ref<number>()
const todayDownloads = ref<number>()
const totalDownloads = ref<number>()
const todayUploads = ref<number>()
const totalUploads = ref<number>()
const todayGroups = ref<number>()
const totalGroups = ref<number>()
const totalCapacity = ref<string>()
const freeCapacity = ref<string>()
const list = ref<getScrollItem[]>([])
const scrollTableLoading = ref<boolean>(false)

const tableRowClassName = computed(()=>{
  return (rowIndex:number) => {
    return rowIndex % 2 === 0 ? 'yellow' : 'orange'
  }
})

const dataItemOptions = computed(()=>[
  createDataItem('upload', uploadCount, '上传量', totalUploads.value, todayUploads.value),
  createDataItem('view', viewCount, '访问量', totalViews.value, todayViews.value),
  createDataItem('capacity', capacity, '总容量', totalCapacity.value, freeCapacity.value),
  createDataItem('group', groupCount, '群组数', totalGroups.value, todayGroups.value),
  createDataItem('download', downloadCount, '下载量', totalDownloads.value, todayDownloads.value),
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
  initBarChart()
  initLineChart()
  getScrollListInfo()
  getBarChartInfo()
  window.addEventListener('resize',handleResize)

})
onBeforeUnmount(()=>{
  window.removeEventListener('resize',handleResize)
})

const initBarChart =  () => {
  let chartDom = document.getElementById('barChart');
  let myChart = echarts.init(chartDom);
  let option:EChartsOption = {
    title:{
      text:'各类文件数量'
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'none'
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '7%',
      containLabel: true
    },
      xAxis:{
        type: 'category',
        splitLine:{//去除网格线
          show:false
        },
        data:['PDF', 'Word', 'Excel', 'Image', 'Video', 'PPT', 'Other','','','','']
      },
    yAxis: {
      gridIndex: 0,

    },
    dataset: {
      source: [
        ['type', '',],
        ['PDF', 40.1 ],
        ['Word', 25.2 ],
        ['Excel', 25.2 ],
        ['Image', 56.5 ],
        ['Video', 51.1 ],
        ['PPT', 25.2 ],
        ['Other', 25.2],
        ['',0],
        ['',0],
        ['',0],
        ['',0],
        ['',0],
      ]
    },
      series:[
        {
          type: 'bar',
          barGap:'80%',/*多个并排柱子设置柱子之间的间距*/
          barCategoryGap:'50%',/*多个并排柱子设置柱子之间的间距*/
          emphasis: {
            focus: 'series',
            itemStyle: {
              shadowBlur: 10,
              shadowColor: 'rgba(0,0,0,0.3)'
            }
          },
          barWidth:30
        },
        {
          name: '各文件占比',
          id: 'pie',
          type: 'pie',
          center: ['75%', '23%'],
          radius: ['15%', '40%'],
          emphasis: {
            focus: 'self',
            label: {
              show: true,
              fontSize: 16,
              fontWeight: 'bold'
            }
          },
          label: {
            show: true,
            // position: 'center',
            // formatter: '{c} ({d}%)'
          },
          z: 100,
        }
      ]
  };
  myChart.setOption(option);
  //   const { data } = await getBarChart();

};

const initLineChart = async ()=>{
  let chartDom = document.getElementById('lineChart');
  let myChart = echarts.init(chartDom);
  let option: EChartsOption;
  option = {
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      left: 'center',
      data: ['下载量', '上传量', '访问量']
    },
    grid: {
      left: '7%',
      right: '4%',
      bottom: '0%',
      containLabel: true
    },
    yAxis: {
      type: 'value'
    },
  };
  const {data} = await getLineChart()
  option.xAxis = {
    type: 'category',
    axisLabel: {
      rotate: 30
    },
    boundaryGap: false,
    data: data.dateList
  }
  option.series = [
    {
      name: '下载量',
      type: 'line',
      smooth:true,
      data: data.downloadList
    },
    {
      name: '上传量',
      type: 'line',
      smooth:true,
      data: data.uploadList
    },
    {
      name: '访问量',
      type: 'line',
      smooth:true,
      data: data.loginList
    }
  ]
  console.log(data,'lineData')
  option && myChart.setOption(option);
}

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



const getScrollListInfo = async ()=>{
  scrollTableLoading.value = true
  const {data} =  await getScrollList()
  list.value = data.map(item => ({
    ...item,
    department: departmentMap[item.department] || item.department
  }))
  scrollTableLoading.value = false
}

const getBarChartInfo = async ()=>{
  const {data} = await getBarChart()
  if(data) {
    const categories = ['Image', 'Video', 'PDF', 'Word', 'Excel', 'PPT', 'Other'];
    const values = [
      data.imageCount,
      data.videoCount,
      data.pdfCount,
      data.wordCount,
      data.excelCount,
      data.pptCount,
      data.otherCount
    ];
    barOption.xAxis = {
      type: 'category',
      data: categories
    };
    barOption.series = [{
      name: 'Count',
      type: 'bar',
      seriesLayoutBy: 'row',
      emphasis: { focus: 'series' },
      data: values
    }];
  }
}

const getCapacityRatio = async ()=>{
  const { data } = await getCapacity()
  totalCapacity.value = data.totalCapacity
  freeCapacity.value = data.freeCapacity
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
    background-color: transparent;

    .carStyle{
      border: 1px solid #e4e7ed;
      background-color: #fff;
      overflow: hidden;
      color: #303133;
      transition: .3s;
      margin: 10px;
    }

    .centerContainer {
      height: 55%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      z-index: 2;
      border-radius:4px;
      border: 1px solid #e4e7ed;
      box-shadow:  0.1em 0.1em .5em rgba(0, 0, 0, 0.3);
      margin: 10px 0;

      .lineChart,.barChart {
        flex: 0 0 49%;
        height: 100%;
        background-color: transparent;
      }
    }

    .topContainer{
      display: flex;
      justify-content: center;
      flex-grow: 1;
      padding-bottom: 5px;
      border-radius:4px;
      margin-bottom: 10px;
      //border: 1px solid #e4e7ed;
      box-shadow:  0.1em 0.1em .5em rgba(0, 0, 0, 0.3);

      ul {
        width: 98%;
        display: flex;
        justify-content: space-between;
        align-items: flex-end;

        li {
          flex: 0 0 19%;
          height: 65%;
          display: flex;
          border-radius: 8px;
          position: relative;
          justify-content: space-between;
          align-items: self-end;

          &:nth-child(1),&:nth-child(5){
            background-color: #b2daf9;
            .icon{
              background-color: #73AEF1;
            }
          }

          &:nth-child(2),&:nth-child(3),&:nth-child(4){
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
            color:#333;
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
            top: -2.5vw;
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
      height: 22%;
      overflow: hidden;
      border-radius:4px;
      border: 1px solid #e4e7ed;
      box-shadow:  0.1em 0.1em .5em rgba(0, 0, 0, 0.3);
      margin-top: 10px;

      .scroll{
        height: 80%;
        .top {
          z-index: 2;
          overflow: hidden;
          background-color: transparent;
        }
        .bottom .el-table__body  {
          margin: 0!important;
          box-sizing: border-box;
          width: 100%;
        }
        .item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 3px 0;
        }
      }
    }
  }
}
</style>
