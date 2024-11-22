import type { ECOption } from "@/components/Echarts/config";
import {useHomeStore} from '@/stores/home'

const homeStore = useHomeStore()

export const  pieOption:ECOption = {
  tooltip: {
    trigger: 'item',
    formatter: (params:any) => {
      const value = params.value;
      console.log(params,'par')
      const usedType = homeStore.usedType
      return `${params.seriesName} <br/> ${params.name} : ${value} ${usedType} (${params.percent}%)`;
    }
  },
  series: [
    {
      type: 'pie',
      name: '容量使用情况',
      radius: ['0', '50%'],
      selectedMode: 'single',
      data: [
        { value: homeStore.totalCapacity, name: '总容量',itemStyle:{
          color: '#87ceeb'
          }},
      ],
      label: {
        fontSize: 18,
        position: 'center'
      },
      labelLine: {
        show: false
      },
    },
    {
      name: '容量使用情况',
      type: 'pie',
      radius: ['70%', '100%'],
      avoidLabelOverlap: false,
      padAngle: 5,
      itemStyle: {
        borderRadius: 10
      },
      label: {
        show: false,
        position: 'center'
      },
      emphasis: {
        label: {
          show: false,
          fontSize: 40,
          fontWeight: 'bold'
        }
      },

      data: [
        { value: homeStore.usedCapacity , name: '已使用',itemStyle:{color:'#ee6666'}},
        { value: homeStore.freeCapacity , name: '未使用' , itemStyle: {color:'#91cc75'}},
      ]
    }
  ]
}
