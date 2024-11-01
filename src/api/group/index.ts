import request from "@/utils/request"
import type {groupResponseData} from './type'

enum GROUP_API {
  GET_GROUP_LIST_URL = '/api/group/list',
}

export const getGroupList = (pageNo:number, pageSize:number,data?:any)=> {
  const url = `${GROUP_API.GET_GROUP_LIST_URL}?pageNo=${pageNo}&pageSize=${pageSize}`
  return request.post<any,groupResponseData>(url,data)
}
