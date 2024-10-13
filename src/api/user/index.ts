import request from "@/utils/request"
import type {LoginForm,ResponseData } from './type'
enum USER_API {
  LOGIN_URL = '/api/user/doLogin',
  LOGOUT_URL = '/api/user/logout',
  GET_USER_INFO = '/api/user/query/',
  SEARCH_USER_URL = '/api/user/list',
  ADD_USER_URL = '/api/user/add',

}

export const userLogin = (data:LoginForm)=>request.post<any>(USER_API.LOGIN_URL,data)

export const getUserInfo = (id:number)=>request.get<ResponseData>(USER_API.GET_USER_INFO+ `${id}`)

export const userLogout = ()=>request.get<ResponseData>(USER_API.LOGOUT_URL)

export const searchUser = (pageNo:number,pageSize:number,username?:string)=>{
  if(username) {
   return request.post<any>(USER_API.SEARCH_USER_URL+`?pageNo=${pageNo}&pageSize=${pageSize}&username=${username}`)
  } else {
   return request.post<any>(USER_API.SEARCH_USER_URL+`?pageNo=${pageNo}&pageSize=${pageSize}`)

  }
}

export const addUser = (userVo :any)=>request.post<any>(USER_API.ADD_USER_URL,userVo )

