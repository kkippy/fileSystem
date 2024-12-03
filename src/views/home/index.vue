<template>
  <div class="homeContainer">
    <div class="topContainer">
      <ul>
        <li @click="handleCheckInfo(item)" v-for="(item) in dataItemOptions"  :key="item.key">
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

    <el-dialog v-model="dialogVisible" width="65%" :title="`今日新增${addType}详情`">
      <div class="searchHeader">
        <el-form>
          <el-form-item style="margin-top: 18px;margin-left: 10px">
            <el-input clearable id="inputGroupField" v-model="searchValue" @keyup.enter="onSearch(searchValue)" :placeholder="`请输入${searchType}`" />
          </el-form-item>
        </el-form>
        <div style="margin-left: 10px">
          <el-button type="primary" :icon="Search" @click="onSearch" :disabled="!searchValue">搜索</el-button>
          <el-button @click="reset" :icon="Refresh" >重置</el-button>
        </div>
      </div>
        <el-table stripe :data="dialogData" height="50vh">
          <el-input size="small" placeholder="Type to search" />
          <el-table-column
            align="center"
            v-for="item in propList"
            :key="item.index"
            :prop="item.prop"
            :label="item.label"
            :width="item.label === '文件名' ? '350' : ''"
             />
        </el-table>
      <el-pagination
        style="margin-top: 20px;"
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :page-sizes="[20, 50, 100]"
        :background="true"
        layout="prev, pager, next, jumper, ->, sizes, total"
        :total="totalNum"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />

    </el-dialog>
  </div>

</template>

<script setup lang="ts">
import uploadCount from '@/assets/images/uploadCount.svg'
import downloadCount from '@/assets/images/downloadCount.svg'
import viewCount from '@/assets/images/viewCount.svg'
import groupCount from '@/assets/images/groupCount.svg'
import capacity from '@/assets/images/capacity.svg'
import { ref, onMounted, onBeforeUnmount, computed,watch } from 'vue'
import {
  getTodayView, getTotalView, getTodayGroup, getTotalDownload, getTotalGroup,
  getTodayDownload, getTodayUpload, getTotalUpload, getCapacity, getScrollList,
  getTodayUploadInfo, getTodayViewInfo,getTodayGroupInfo,getTodayDownloadInfo
} from '@/api/home'
import  {createDataItem,departmentMap,barOption,lineOption,uploadPropList,downloadPropList,viewPropList,groupPropList} from "./config/option"
import { Vue3SeamlessScroll  } from 'vue3-seamless-scroll'
import  type {getScrollItem} from "@/api/home/type"
import * as echarts from 'echarts';
import scrollTable from "./components/scrollTable.vue"
import { Refresh, Search } from '@element-plus/icons-vue'

interface propItem {
  index:number,
  label:string,
  prop:string
}

const todayViews = ref<number>()
const totalViews = ref<number>()
const todayDownloads = ref<number>()
const totalDownloads = ref<number>()
const todayUploads = ref<number>()
const totalUploads = ref<number>()
const todayGroups = ref<number>()
const totalGroups = ref<number>()
const totalCapacity = ref<string>()
const usedCapacity = ref<string>()
const list = ref<getScrollItem[]>([])
const scrollTableLoading = ref<boolean>(false)
const dialogData = ref<any[]>([])
const dialogVisible = ref<boolean>(false)
const propList = ref<propItem[]>([])
const addType = ref<string>('上传')
const searchType = ref<string>('')
const currentPage = ref<number>(1)
const pageSize = ref<number>(10)
const totalNum = ref<number>(0)
const liItem = ref([])
const searchValue = ref('')

const dataItemOptions = computed(()=>[
  createDataItem('upload', uploadCount, '上传量', totalUploads.value, todayUploads.value),
  createDataItem('view', viewCount, '访问量', totalViews.value, todayViews.value),
  createDataItem('capacity', capacity, '总容量', totalCapacity.value, usedCapacity.value),
  createDataItem('group', groupCount, '群组数', totalGroups.value, todayGroups.value),
  createDataItem('download', downloadCount, '下载量', totalDownloads.value, todayDownloads.value),
])

const groupField = document.getElementById('inputGroupField');
groupField?.addEventListener('keyup', function(event) {
  if (event.key === 'Enter') {
    onSearch(searchValue.value)
  }
});

watch(()=>searchValue.value, ()=>{
  if(searchValue.value === '') {
    reset()
  }
})

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
  window.addEventListener('resize',handleResize)
})
onBeforeUnmount(()=>{
  window.removeEventListener('resize',handleResize)
})

const initBarChart = () => {
  let chartDom = document.getElementById('barChart');
  let myChart = echarts.init(chartDom);
  myChart.setOption(barOption);
};

const initLineChart = ()=>{
  let chartDom = document.getElementById('lineChart');
  let myChart = echarts.init(chartDom);
  myChart.setOption(lineOption);
}

const handleResize = ()=>{
  window.location.reload();
}

const fetchData = async (apiFunction:any, params = {}) => {
  try {
    const { data } = await apiFunction(currentPage.value, pageSize.value, params);
    dialogData.value = data.items || [];
    totalNum.value = data.counts;
  } catch (error) {
    console.error('请求失败:', error);
  }
};

const apiMap:any = {
  '上传文件名': { api: getTodayUploadInfo, propList: uploadPropList },
  '工号': { api: getTodayViewInfo, propList: viewPropList },
  '群组名': { api: getTodayGroupInfo, propList: groupPropList },
  '下载文件名': { api: getTodayDownloadInfo, propList: downloadPropList }
};

const onSearch = async (searchValue:string) =>{
  const { api, propList } = apiMap[searchType.value];
  await fetchData(api,
    { [searchType.value === '上传文件名'
        ? 'uploadName' : searchType.value === '工号'
          ? 'userNumber' : searchType.value === '群组名'
            ? 'groupName' : 'fileName']: searchValue });
  propList.value = propList;
}

const reset = async () => {
  const { api, propList } = apiMap[searchType.value];
  await fetchData(api);
  propList.value = propList;
}

const handleCheckInfo = async (item:any,pager = 1) =>{
  currentPage.value = pager
  searchValue.value = ''
  if (item.key === 'capacity') return;
  Object.assign(liItem,item)

  let { data:uploadData } = await getTodayUploadInfo(currentPage.value,pageSize.value)
  let { data:downloadData } = await getTodayDownloadInfo(currentPage.value,pageSize.value)
  let { data:groupData } = await getTodayGroupInfo(currentPage.value,pageSize.value)
  let { data:viewData } = await getTodayViewInfo(currentPage.value,pageSize.value)

  const setData = (type: string, search: string, data: any[], prop: any[], counts: number) => {
    addType.value = type;
    searchType.value = search;
    dialogVisible.value = true;
    dialogData.value = data.map(item => {
      if(item.uploadType === 'file') {
        item.uploadType = '文件'
      }
      if(item.uploadType === 'link') {
        item.uploadType = '链接'
      }
      return item
    }) || [];
    propList.value = prop;
    totalNum.value = counts;
  };
  switch (item.key) {
    case 'upload':
      setData('上传', '上传文件名', uploadData.items, uploadPropList, uploadData.counts);
      break;
    case 'view':
      setData('访问', '工号', viewData.items, viewPropList, viewData.counts);
      break;
    case 'group':
      setData('群组', '群组名', groupData.items, groupPropList, groupData.counts);
      break;
    case 'download':
      setData('下载', '下载文件名', downloadData.items, downloadPropList, downloadData.counts);
      break;
  }
}

const handleSizeChange = () => {
  currentPage.value = 1
  handleCheckInfo(liItem)
}

const handleCurrentChange = (e:number) => {
  handleCheckInfo(liItem,e)
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

const getCapacityRatio = async ()=>{
  const { data } = await getCapacity()
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
      height: 50%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      z-index: 2;
      border-radius:4px;
      border: 1px solid #e1e1de;
      box-shadow:  0.1em 0.1em .5em rgba(0, 0, 0, 0.1);
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
      height: 20%;
      padding-bottom: 5px;
      border-radius:4px;
      margin-bottom: 10px;
      border: 1px solid #e1e1de;
      box-shadow:  0.1em 0.1em .5em rgba(0, 0, 0, 0.1);

      ul {
        width: 98%;
        display: flex;
        justify-content: space-between;
        align-items: center;

        li {
          flex: 0 0 19%;
          height: 90%;
          display: flex;
          border-radius: 8px;
          position: relative;
          justify-content: space-between;
          align-items: self-end;
          &:hover{
            cursor: pointer;
          }

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

          &:nth-child(3){

            &:hover{
              cursor: default;
            }

            .right {
              flex:0 0 60%;
              padding: 0;
              p:nth-child(1){
                font-size: 1.6vw;
                margin: 16px 0 0 0;
              }
              p:nth-child(2){
                font-size: 2.4rem;
                font-weight: bold;
                margin: 30px 0 0 0;
              }
            }
          }

          .left,.right{
            display: flex;
            flex-direction: column;
            flex:0 0 35%;
            padding-left: 10px;
            color:#383c3c;
            p:nth-child(1){
              font-size: 1.4rem;
            }
            p:nth-child(2){
              font-size: 1.4rem;
              font-weight: bold;
            }
          }

          .right {
            height: 100%;
            flex:0 0 60%;
            padding-left:0;
            justify-content: start;
            p:nth-child(1){
              font-size: 1.6vw;
              margin: 16px 0 0 10px;
            }
            p:nth-child(2){
              font-size: 3rem;
              font-weight: bold;
              margin: 30px 0 0 30px;
            }
          }

          .icon {
            width: 4vw;
            height: 4vw;
            flex-grow: 1;
            position: absolute;
            top: 1.5vh;
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
      border: 1px solid #e1e1de;
      box-shadow:  0.1em 0.1em .5em rgba(0, 0, 0, 0.1);
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

    .searchHeader {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      flex-direction: row;
    }
  }
}
</style>
