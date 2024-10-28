import {defineStore} from 'pinia'
import {SET_TOKEN,GET_TOKEN,
  REMOVE_TOKEN,SET_USER,
  GET_USER,REMOVE_USER,
  GET_USERNAME,SET_USERNAME,
  REMOVE_USER_NAME
} from "@/utils/token"
import { getUserInfo, userLogin, userLogout } from '@/api/user'
// import {getAllBuckets} from '@/api/file'
import type {LoginForm} from "@/api/user/type";
import { SET_PATH,REMOVE_PATH,GET_PATH } from '@/utils/path'

export interface storeState {
  token: string,
  userRole:string,
  userName: string,
  sessionTime: number | string,
  userId: number | string,
  layoutStatus:boolean,
  help:boolean,
  path:string,
}

export const useUserStore = defineStore('user', {
  state: (): storeState => {
    return {
      token: GET_TOKEN() || '',// 用户的token
      userRole: GET_USER() || '',
      userName: GET_USERNAME() || '',
      sessionTime: '',
      userId: '',
      layoutStatus:false, //true代表列表模式，false代表图标模式
      help:false,//漫游式引导
      path:GET_PATH() || '/' //用于面包屑导航
    }
  },
  actions: {
    async userLogin(userData: LoginForm) {
      const result: any = await userLogin(userData)
      if (result.code == 200) {
        this.token = (result.data.tokenValue as string)
        this.userRole = result.data.roleList[0]
        this.userId = parseInt(result.data.loginId)
        SET_USER(this.userRole as string)
        SET_TOKEN(this.token as string)
        SET_PATH(this.path as string)
        // await getAllBuckets()
        return 'ok'
      } else {
        return Promise.reject(new Error(result.data))
      }

    },

    async getInfo() {
      //存储用户信息
      const result:any = await getUserInfo()
      if (result.code === 200) {
        this.userName = result.data.account
        SET_USERNAME(result.data.account as string)
        return 'ok'
      } else {
        return Promise.reject(new Error(result.message ))
      }
    },

    async userLogouts() {
      try {
        await userLogout()
        this.token = ''
        this.userName = ''
        this.userRole = ''
        REMOVE_TOKEN()
        REMOVE_USER()
        REMOVE_USER_NAME()
        REMOVE_PATH()
        return 'ok'
      } catch (err) {
        return Promise.reject(new Error((err as string)))
      }
    }
  }
})
