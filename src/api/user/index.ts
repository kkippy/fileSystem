import request from "@/utils/request"
import type {LoginForm,ResponseData } from './type'
enum USER_API {
  LOGIN_URL = '/api/user/doLogin',
  LOGOUT_URL = '/api/user/logout',
  GET_USER_INFO = '/api/user/query',
  SEARCH_USER_URL = '/api/user/list',
  ADD_USER_URL = '/api/user/add',
  DELETE_USER_URL = '/api/user/delete',
  UPDATE_USER_URL = '/api/user/update'

}

export const userLogin = (data:LoginForm)=>request.post<any>(USER_API.LOGIN_URL,data)

export const getUserInfo = ()=>request.get<ResponseData>(USER_API.GET_USER_INFO)

export const userLogout = ()=>request.get<ResponseData>(USER_API.LOGOUT_URL)

export const searchUser = (pageNo:number, pageSize:number,data?:any)=>{
  const url = `${USER_API.SEARCH_USER_URL}?pageNo=${pageNo}&pageSize=${pageSize}`
   return request.post<any>(url,data)
}

export const addOrUpdateUser = (data :any)=>{
  if(data.id){
    return request.post<any>(USER_API.UPDATE_USER_URL,data)
  } else {
    return request.post<any>(USER_API.ADD_USER_URL,data )

  }
}

export const updateUser = (userVo :any)=>request.post<any>(USER_API.UPDATE_USER_URL,userVo )
export const deleteUser = (id:number)=>request.get<any>(USER_API.DELETE_USER_URL+`?id=${id}`)
