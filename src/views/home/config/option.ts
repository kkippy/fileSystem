import type { ECOption } from "@/components/Echarts/config";
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
        { value: 1048, name: '总容量',itemStyle:{
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
        { value: 1048, name: '已使用',itemStyle:{color:'#ee6666'} },
        { value: 735, name: '未使用' , itemStyle: {color:'#91cc75'}},
      ]
    }
  ]
}