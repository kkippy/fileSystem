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
import { ref, onMounted, onBeforeUnmount, computed, watch } from 'vue'
import {
  getTodayView, getTotalView, getTodayGroup, getTotalDownload, getTotalGroup,
  getTodayDownload, getTodayUpload, getTotalUpload, getCapacity, getScrollList,
  getTodayUploadInfo, getTodayViewInfo, getTodayGroupInfo, getTodayDownloadInfo,
  getLineChart
} from '@/api/home'
import  {createDataItem,departmentMap,barOption,lineOption,uploadPropList,downloadPropList,viewPropList,groupPropList} from "./config/option"
import { Vue3SeamlessScroll  } from 'vue3-seamless-scroll'
import type { getLineChartResponseData, getScrollItem } from '@/api/home/type'
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
let lineChartInstance:any

watch(()=> todayUploads.value,(oldValue,newValue)=>{
  if(oldValue !== newValue){
    updateLineChart()
  }
})

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
  lineChartInstance = echarts.init(document.getElementById('lineChart'));
  lineChartInstance.setOption(lineOption);
}

const updateLineChart = async ()=>{
  const response: getLineChartResponseData = await getLineChart();
  const data = response.data;

  const { downloadList, uploadList, loginList } = data;
  if (lineOption.series && Array.isArray(lineOption.series)) {
    (lineOption.series)[0].data = downloadList
    lineOption.series[1].data = uploadList
    lineOption.series[2].data = loginList
  }

  if (lineChartInstance) {
    lineChartInstance.setOption(lineOption);
  }

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

<style lang="scss" scoped>
@import "./style";

</style>


