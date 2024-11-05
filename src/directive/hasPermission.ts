import pinia from '@/stores'
import {useUserStore} from "@/stores/user"
const userStore = useUserStore(pinia)
export const hasPermission = (app:any) => {
  //全局自定义指令
  app.directive('permission', {
    mounted(el:any,options:any){
      //若自定义指令右侧的值不在权限列表中，则删除该元素，注意每个按钮都要设置指令
      if(!userStore.permissionList.includes(options.value)){
        el.parentNode.removeChild(el)
      }

    }
  })
}