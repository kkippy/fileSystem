import request from "@/utils/request"
import type { ResponseData,linkResponseData,searchResponseData } from './type'

enum LINK_API {
  GET_LINK_LIST_URL = '/link/list',
  CHECK_LINK_URL = '/link/query',
  DELETE_LINK_URL = '/link/delete',
  UPDATE_LINK_URL = '/link/update',
  UPLOAD_LINK_URL = '/link/uploadLink',
}
export const getLinks = (pageNo:number, pageSize:number,department:string,data?:any)=> {
  const url = `${LINK_API.GET_LINK_LIST_URL}?pageNo=${pageNo}&pageSize=${pageSize}&department=${department}`
  return request.post<any,linkResponseData>(url,data)
}

export const checkLink = (id:number)=> request.get<any,searchResponseData>(LINK_API.CHECK_LINK_URL+`?id=${id}`)

export const uploadLink = (linkName:string,linkAddress:string,department:string)=> request.get<any,ResponseData>(LINK_API.UPLOAD_LINK_URL+ `?linkName=${linkName}&linkAddress=${linkAddress}&department=${department}`)

export const updateLink = (id:number,data:any)=> {
  const url = `${LINK_API.UPDATE_LINK_URL}?id=${id}`
  return request.post<any>(url, data)
}

export const deleteLink = (id:number)=> request.get<any>(LINK_API.DELETE_LINK_URL+`?id=${id}`)
