import request from "@/utils/request"
import type {
  getViewInfo, getUploadInfo, getGroupInfoResponseData,
  getGroupInfo, getDownloadInfo, getViewInfoResponseData,
  getUploadInfoResponseData, getDownloadInfoResponseData,
  getCapacityResponseData, getScrollListResponseData,
  getLineChartResponseData, getBarChartResponseData
} from './type'

enum DATA_API {
  // 访问量
  TODAY_VIEW_URL = '/home/visits',
  TOTAL_VIEW_URL = '/home/visitsTotal',
  GET_TODAY_VIEW_INFO_URL = '/home/listVisits',

  // 上传量
  TODAY_UPLOAD_URL = '/home/uploads',
  TOTAL_UPLOAD_URL = '/home/uploadsTotal',
  GET_TODAY_UPLOAD_INFO_URL = '/home/listUploads',

  // 群组量
  TODAY_GROUP_URL = '/home/groups',
  TOTAL_GROUP_URL = '/home/groupsTotal',
  GET_TODAY_GROUP_INFO_URL = '/home/listGroups',


  //下载量
  TODAY_DOWNLOAD_URL = '/home/downloads',
  TOTAL_DOWNLOAD_URL = '/home/downloadsTotal',
  GET_TODAY_DOWNLOAD_INFO_URL = '/home/listDownloads',

  //容量
  GET_CAPACITY_URL = '/home/capacity',

  //滚动列表
  GET_SCROLL_LIST_URL = '/home/scrolledList',

  //折线图
  GET_LINE_CHART_URL = '/home/lineChart',

  //柱状图
  GET_BAR_CHART_URL = '/home/barChart'

}

export const getTodayView = ()=>request.get<any>(DATA_API.TODAY_VIEW_URL)

export const getTotalView = ()=>request.get<any>(DATA_API.TOTAL_VIEW_URL)

export const getTodayViewInfo = (pageNo:number,pageSize:number,data?:getViewInfo)=>{
  const url = `${DATA_API.GET_TODAY_VIEW_INFO_URL}?pageNo=${pageNo}&pageSize=${pageSize}`
  return request.post<any,getViewInfoResponseData>(url,data)
}

export const getTodayUpload = ()=>request.get<any>(DATA_API.TODAY_UPLOAD_URL)

export const getTotalUpload = ()=>request.get<any>(DATA_API.TOTAL_UPLOAD_URL)

export const getTodayUploadInfo = (pageNo:number,pageSize:number,data?:getUploadInfo)=>{
  const url = `${DATA_API.GET_TODAY_UPLOAD_INFO_URL}?pageNo=${pageNo}&pageSize=${pageSize}`
  return request.post<any,getUploadInfoResponseData>(url,data)
}

export const getTodayGroup = ()=>request.get<any>(DATA_API.TODAY_GROUP_URL)

export const getTotalGroup = ()=>request.get<any>(DATA_API.TOTAL_GROUP_URL)

export const getTodayGroupInfo = (pageNo:number,pageSize:number,data?:getGroupInfo)=>{
  const url = `${DATA_API.GET_TODAY_GROUP_INFO_URL}?pageNo=${pageNo}&pageSize=${pageSize}`
  return request.post<any,getGroupInfoResponseData>(url,data)
}

export const getTodayDownload = ()=>request.get<any>(DATA_API.TODAY_DOWNLOAD_URL)

export const getTotalDownload = ()=>request.get<any>(DATA_API.TOTAL_DOWNLOAD_URL)

export const getTodayDownloadInfo = (pageNo:number,pageSize:number,data?:getDownloadInfo)=>{
  const url = `${DATA_API.GET_TODAY_DOWNLOAD_INFO_URL}?pageNo=${pageNo}&pageSize=${pageSize}`
  return request.post<any,getDownloadInfoResponseData>(url,data)
}

export const getCapacity = ()=>request.get<any,getCapacityResponseData>(DATA_API.GET_CAPACITY_URL)

export const getScrollList = ()=>request.get<any,getScrollListResponseData>(DATA_API.GET_SCROLL_LIST_URL)

export const getLineChart = ()=>request.get<any,getLineChartResponseData>(DATA_API.GET_LINE_CHART_URL)

export const getBarChart = ()=>request.get<any,getBarChartResponseData>(DATA_API.GET_BAR_CHART_URL)