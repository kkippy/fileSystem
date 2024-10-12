import {defineStore} from 'pinia'
import {SET_TOKEN,GET_TOKEN,REMOVE_TOKEN,SET_USER,GET_USER,REMOVE_USER} from "@/utils/token"
import { getUserInfo, userLogin, userLogout } from '@/api/user'
import type {LoginForm} from "@/api/user/type.ts";

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
      userName:'',
      sessionTime:'',
      userId:''
    }
  },
  actions: {
    async userLogin(userData:LoginForm){
      const result:any = await userLogin(userData)
      console.log(result,'登录接口相应')
      this.token = result.data.tokenValue as string
      this.userRole = result.data.roleList[0]
      this.sessionTime = result.data.sessionTime
      SET_USER(result.data.roleList[0] as string)
      console.log(this.userRole,'the')
      SET_TOKEN(result.data.tokenValue as string)
      return result
    },

     async getInfo(){
     const {code,data,message} = await  getUserInfo( (this.userId as number))
       if(code === 200){
         this.userName = data.username
         return Promise.resolve(data)

       } else {
         return Promise.reject(new Error(message))
       }
    },

    async userLogout(){
      const {code} = await userLogout()
      if(code == 200){
        this.token = ''
        this.userName = ''
        REMOVE_TOKEN()
        REMOVE_USER()
        return 'ok'
      } else {
        return Promise.reject(new Error('退出失败'))
      }

    }

  }
})