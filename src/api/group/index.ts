import request from "@/utils/request"
import type {groupResponseData,addGroupResponseData,searchGroupResponseData} from './type'

enum GROUP_API {
  GET_GROUP_LIST_URL = '/group/list',
  SEARCH_GROUP_URL = '/group/query/',
  ADD_GROUP_URL = '/group/create',
  DELETE_GROUP_URL = '/group/delete',
  ADD_GROUP_USER_URL = '/group/addUser',
  DELETE_GROUP_USER_URL = '/group/removeUser',
  ADD_GROUP_FILE_URL = '/group/addFile',
  DELETE_GROUP_FILE_URL = '/group/removeFile',
  ADD_GROUP_LINK_URL = '/group/addLink',
  DELETE_GROUP_LINK_URL = '/group/removeLink',
  UPDATE_GROUP_URL = '/group/update'

}

export const getGroupList = (pageNo:number, pageSize:number,data?:any)=> {
  const url = `${GROUP_API.GET_GROUP_LIST_URL}?pageNo=${pageNo}&pageSize=${pageSize}`
  return request.post<any,groupResponseData>(url,data)
}

export const searchGroup = (groupId:number)=>request.get<any,searchGroupResponseData>(GROUP_API.SEARCH_GROUP_URL+`${groupId}`)

export const addGroup = (groupName:string)=>request.get<any,addGroupResponseData>(GROUP_API.ADD_GROUP_URL+`?groupName=${groupName}`)

export const updateGroup = (groupId:number,data:any)=>{
  const url = `${GROUP_API.UPDATE_GROUP_URL}?groupId=${groupId}`
  return request.post<any>(url,data)
}

export const deleteGroup = (groupId:number)=>request.get<any>(GROUP_API.DELETE_GROUP_URL+`?groupId=${groupId}`)

export const addGroupUser = (groupId:number,data?:any)=>{
  const id = `${GROUP_API.ADD_GROUP_USER_URL}?groupId=${groupId}`
  return request.post<any>(id,data)
}

export const deleteGroupUser = (groupId:number,data?:any)=>{
  const id = `${GROUP_API.DELETE_GROUP_USER_URL}?groupId=${groupId}`
  return request.post<any>(id,data)
}

export const addGroupFile = (groupId:number,data?:any)=>{
  const id = `${GROUP_API.ADD_GROUP_FILE_URL}?groupId=${groupId}`
  return request.post<any>(id,data)
}

export const deleteGroupFile = (groupId:number,data?:any)=>{
  const id = `${GROUP_API.DELETE_GROUP_FILE_URL}?groupId=${groupId}`
  return request.post<any>(id,data)
}

export const addGroupLink = (groupId:number,data?:any)=>{
  const id = `${GROUP_API.ADD_GROUP_LINK_URL}?groupId=${groupId}`
  return request.post<any>(id,data)
}

export const deleteGroupLink = (groupId:number,data?:any)=>{
  const id = `${GROUP_API.DELETE_GROUP_LINK_URL}?groupId=${groupId}`
  return request.post<any>(id,data)
}
