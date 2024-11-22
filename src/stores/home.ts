import {defineStore} from 'pinia'
import {getCapacity} from "@/api/home"
import { ref } from 'vue'
import type { getCapacityResponseData } from '@/api/home/type'

interface storeState {
  totalCapacity:  number,
  usedCapacity: number,
  freeCapacity: number,
  usedType:string
}

export const useHomeStore = defineStore('home',{
  state():storeState {
      return {
        totalCapacity:10,
        usedCapacity:10,
        freeCapacity:10,
        usedType:''
      }
  },
  actions:{
    async getCapacityRatio(){
      const result:getCapacityResponseData = await getCapacity()
        const totalMatch = result.data.totalCapacity ?.substring(0, result.data.totalCapacity .length - 3);
        const usedMatch = result.data.usedCapacity ?.substring(0, result.data.usedCapacity .length - 3);
        const freeMatch = result.data.freeCapacity ?.substring(0, result.data.freeCapacity.length - 3);

        const usedType = result.data.usedCapacity.substring(result.data.usedCapacity.length - 2, result.data.usedCapacity.length)

        this.totalCapacity = parseFloat(totalMatch)
        this.usedCapacity = parseFloat(usedMatch)
        this.freeCapacity = parseFloat(freeMatch)
        this.usedType = usedType

      console.log(typeof this.freeCapacity,usedType)
    }
  }
})
