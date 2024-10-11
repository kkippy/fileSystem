import {defineStore} from 'pinia'
import {SET_TOKEN,GET_TOKEN,REMOVE_TOKEN} from "@/utils/token.ts"
export const useUserStore = defineStore('user', {
  state: () => {
    return {
      token:GET_TOKEN() ||'',// 用户的token
      userName:'',
    }
  },
  actions: {
    userLogin(){
      this.token = 'token'
      SET_TOKEN('token')
    },
    getUserInfo(){
      this.userName = 'adminUser'
    },
    userLogout(){
      this.token = ''
      this.userName = ''
      REMOVE_TOKEN()
    }
  }
})