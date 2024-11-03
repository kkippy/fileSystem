import request from "@/utils/request"
import type {groupResponseData,addGroupResponseData} from './type'

enum GROUP_API {
  GET_GROUP_LIST_URL = '/api/group/list',
  ADD_GROUP_URL = '/api/group/create',
  DELETE_GROUP_URL = '/api/group/delete',
  ADD_GROUP_USER_URL = '/api/group/addUser',
  DELETE_GROUP_USER_URL = '/api/group/removeUser',
  ADD_GROUP_FILE_URL = '/api/group/addFile',
  DELETE_GROUP_FILE_URL = '/api/group/removeFile',
  ADD_GROUP_LINK_URL = '/api/group/addLink',
  DELETE_GROUP_LINK_URL = '/api/group/removeLink',

}

export const getGroupList = (pageNo:number, pageSize:number,data?:any)=> {
  const url = `${GROUP_API.GET_GROUP_LIST_URL}?pageNo=${pageNo}&pageSize=${pageSize}`
  return request.post<any,groupResponseData>(url,data)
}

export const addGroup = (groupName:string)=>request.get<any,addGroupResponseData>(GROUP_API.ADD_GROUP_URL+`?groupName=${groupName}`)

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