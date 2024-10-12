import request from "@/utils/request"
import type {LoginForm,ResponseData } from './type'
enum USER_API {
  LOGIN_URL = '/api/user/doLogin',
  LOGOUT_URL = '/api/user/logout',
  GET_USER_INFO = '/api/user/query/'

}

export const userLogin = (data:LoginForm)=>request.post<any>(USER_API.LOGIN_URL,data)

export const getUserInfo = (id:number)=>request.get<ResponseData>(USER_API.GET_USER_INFO+ `${id}`)

export const userLogout = ()=>request.get<ResponseData>(USER_API.LOGOUT_URL)
