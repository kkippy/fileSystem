import {defineStore} from 'pinia'
import {SET_TOKEN,GET_TOKEN,
  REMOVE_TOKEN,SET_USER,
  GET_USER,REMOVE_USER,
  GET_USERNAME,SET_USERNAME,
  REMOVE_USER_NAME
} from "@/utils/token"
import { getUserInfo, userLogin, userLogout } from '@/api/user'
import {getAllBuckets} from '@/api/file'
import type {LoginForm} from "@/api/user/type.ts";
import { useRoute, useRouter } from 'vue-router'

const router = useRouter()
const route = useRoute()

export interface storeState {
  token: string,
  userRole:string,
  userName: string,
  sessionTime: number | string,
  userId: number | string
}

export const useUserStore = defineStore('user', {
  state: ():storeState => {
    return {
      token:GET_TOKEN() ||'',// 用户的token
      userRole:GET_USER() || '',
      userName:GET_USERNAME() || '',
      sessionTime:'',
      userId:''
    }
  },
  actions: {
    async userLogin(userData:LoginForm){
      const result:any = await userLogin(userData)
      if(result.code == 200){
        console.log(result,'登录接口相应')
        this.token = (result.data.tokenValue as string)
        this.userRole = result.data.roleList[0]
        this.userId = parseInt(result.data.loginId)
        SET_USER(this.userRole as string)
        SET_TOKEN(this.token as string)
        await getAllBuckets()
        return 'ok'

      }else {
        return Promise.reject(new Error(result.data))
      }

    },

     async getInfo(){
      //存储用户信息
     const {code,data,message} = await  getUserInfo()
       if(code === 200){
         this.userName = data.username
         // SET_USERNAME(data.username as string)
         console.log(this.userName)
          return 'ok'
       } else {
         // this.token = ''
         // this.userName = ''
         // this.userRole = ''
         // REMOVE_TOKEN()
         // REMOVE_USER()
         // REMOVE_USER_NAME()
         // await router.push({
         //   path: '/login',
         //   query: {
         //     redirect: route.path
         //   }
         // })
         return Promise.reject(new Error(message))
       }
    },

    async userLogouts(){
      const result = await userLogout()
      console.log(result,'退出接口响应')
      if(result.code == 200){
        this.token = ''
        this.userName = ''
        this.userRole = ''
        REMOVE_TOKEN()
        REMOVE_USER()
        // REMOVE_USER_NAME()
        return 'ok'
      } else {
        // await router.push({
        //   path: '/login',
        //   query: {
        //     redirect: route.path
        //   }
        // })

        return Promise.reject(new Error('退出失败'))
      }

    }

  }
})