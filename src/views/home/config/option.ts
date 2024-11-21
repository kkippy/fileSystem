import type { ECOption } from "@/components/Echarts/config";
import { getCapacity } from '@/api/home'
import { computed, onMounted, ref } from 'vue'

const totalCapacity = ref<number>()
const usedCapacity = ref<number>()

onMounted(()=>{
  getCapacityRatio().then(res => {
    console.log(res,'res')
    // totalCapacity.value = res.data.totalCapacity
    // usedCapacity.value = res.data.usedCapacity
  })
})

const getCapacityRatio = async ()=>{
  const { data } = await getCapacity()
  console.log(data,'data')
  totalCapacity.value = data.totalCapacity
  usedCapacity.value = data.usedCapacity
}


const freeCapacity = computed(()=>{
  return (totalCapacity.value as number)  - (usedCapacity.value as number)
})
export const  pieOption:ECOption = {
  tooltip: {
    trigger: 'item',
    formatter:'{a} <br/>{b} : {c}GB ({d}%)',
  },
  series: [
    {
      type: 'pie',
      name: '容量使用情况',
      radius: ['0', '50%'],
      selectedMode: 'single',
      data: [
        { value: totalCapacity.value, name: '总容量',itemStyle:{
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
        { value: usedCapacity.value, name: '已使用',itemStyle:{color:'#ee6666'} },
        { value: freeCapacity.value, name: '未使用' , itemStyle: {color:'#91cc75'}},
      ]
    }
  ]
}
