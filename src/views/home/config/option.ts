import { getBarChart, getLineChart } from '@/api/home'
import * as echarts from 'echarts'
type EChartsOption = echarts.EChartsOption;

export const createDataItem = (key: string, icon: any, title: string, total: any, todayCount: any) => ({
  key,
  icon,
  title,
  total,
  today: title === '总容量' ? '剩余' : '今日',
  todayCount,
});


const {data:data1 } = await getBarChart();
const {
  imageCount, videoCount, pdfCount,
  wordCount, excelCount, pptCount,
  otherCount } = data1;
const barData = [
  { value: pdfCount, itemStyle: { color: '#5470c6' } },
  { value: wordCount, itemStyle: { color: '#91cc75' } },
  { value: excelCount, itemStyle: { color: '#fac858' } },
  { value: imageCount, itemStyle: { color: '#ee6666' } },
  { value: videoCount, itemStyle: { color: '#73c0de' } },
  { value: pptCount, itemStyle: { color: '#3ba272' } },
  { value: otherCount, itemStyle: { color: '#fc8452' } },
];
const pieData = [
  { value: pdfCount, name: 'PDF' },
  { value: wordCount, name: 'Word' },
  { value: excelCount, name: 'Excel' },
  { value: imageCount, name: 'Image' },
  { value: videoCount, name: 'Video' },
  { value: pptCount, name: 'PPT' },
  { value: otherCount, name: 'Other' },
];


export const barOption:EChartsOption = {
  title:{
  },
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'none'
    }
  },
  legend:{},
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
    axisTick: {
      alignWithLabel: true
    },
    data:['PDF', 'Word', 'Excel', 'Image', 'Video', 'PPT', 'Other','','','','']
  },
  yAxis: {
    gridIndex: 0,
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
      itemStyle:{
        color:'#4EB5F7',
        borderRadius:[10,10,0,0]
      },
      barWidth:30,
      data: barData
    },
    {
      name: '各文件占比',
      type: 'pie',
      avoidLabelOverlap: false,
      center: ['80%', '40%'],
      radius: ['25%', '50%'],
      itemStyle: {
        borderRadius: 5,
        borderColor: '#fff',
        borderWidth: 2
      },
      emphasis: {
        focus: 'self',
        label: {
          show: true,
          fontSize: 16,
          fontWeight: 'bold',
          formatter: '{b}({d}%)'
        }
      },
      label: {
        show: false,
        position: 'center'
      },
      data: pieData,
      z: 100,
    }
  ]
}

const {data:data2} = await getLineChart()
const  {downloadList, uploadList,loginList,dateList} = data2
export const lineOption:EChartsOption = {
  tooltip: {
    trigger: 'axis'
  },
  legend: {
    left: 'center',
    data: ['下载量', '上传量', '访问量']
  },
  xAxis: {
    type: 'category',
    axisLabel: {
      rotate: 30,
      fontSize: 10,
    },
    boundaryGap: false,
    data: dateList
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
  series:[
    {
      name: '下载量',
      type: 'line',
      smooth: true,
      data: downloadList,
    },
    {
      name: '上传量',
      type: 'line',
      smooth: true,
      data: uploadList,
    },
    {
      name: '访问量',
      type: 'line',
      smooth: true,
      data: loginList,
    }
  ]
}
export const departmentMap:Record<string, string> = {
  "basic": "基础架构室",
  "section1": "信息化一室",
  "section2": "信息化二室",
  "support": "开发支持室",
  "manage": "综合管理室"
};
