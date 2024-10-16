import request from "@/utils/request"
import type {fileResponse} from './type'
enum FILE_API {
  GET_ALL_BUCKET_URL = '/api/file/listBuckets', //查询所有桶
  DELETE_BUCKET_URL = '/api/file/deleteBucket', //删除桶
  UPLOAD_FILE_URL = '/api/file/uploadfile', //上传文件
  DOWNLOAD_FILE_URL = '/api/file/downloadFile', //下载文件
  DELETE_FILE_URL = '/api/file/deleteFile', //删除文件
  GET_FILE_URL = '/api/file/listFiles',//查询桶中的文件
  SHARE_FILE_URL = '/api/file/presignedUrl',//分享文件(即直接获取文件下载链接)
}

export const getAllBuckets = ()=>request.get<any>(FILE_API.GET_ALL_BUCKET_URL)

export const deleteBucket = (bucketName:string)=>request.get<any>(FILE_API.DELETE_BUCKET_URL+`?bucketName=${bucketName}`)

export const uploadFile = (data:any)=>{
  return request.post<any>(FILE_API.UPLOAD_FILE_URL,data,{
    headers:{
      'Content-Type':'multipart/form-data'
    },
  })
}

export const downloadFile = (bucket:string,objectName:string)=>request.get<any>(FILE_API.DOWNLOAD_FILE_URL+`?bucket=${bucket}&objectName=${objectName}`,{responseType:'blob'})

export const deleteFile = (bucket:string,objectName:string)=>request.get<any>(FILE_API.DELETE_FILE_URL+`?bucket=${bucket}&objectName=${objectName}`)

export const getFileList = (bucket:string,pageNo:number,pageSize:number,fileName?:string)=> {
  if (!fileName) {
    return request.get<any, fileResponse>(FILE_API.GET_FILE_URL + `?bucket=${bucket}&pageNo=${pageNo}&pageSize=${pageSize}`)
  } else {
    return request.get<any, fileResponse>(FILE_API.GET_FILE_URL + `?bucket=${bucket}&pageNo=${pageNo}&pageSize=${pageSize}&fileName=${fileName}`)
  }
}

export const shareFile = (bucket:string,objectName:string)=>request.get<any>(FILE_API.SHARE_FILE_URL+`?bucket=${bucket}&objectName=${objectName}`)



