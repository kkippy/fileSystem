import request from "@/utils/request"
import type {fileResponse} from './type'
enum FILE_API {
  // GET_ALL_BUCKET_URL = '/api/file/list', //查询所有桶
  DELETE_BUCKET_URL = '/api/file/deleteBucket', //删除桶
  UPLOAD_FILE_URL = '/api/file/uploadfile', //上传文件
  DOWNLOAD_FILE_URL = '/api/file/downloadFile', //下载文件
  RENAME_FILE_URL = '/api/file/updateFile',
  DELETE_FILE_URL = '/api/file/deleteFile', //删除文件
  GET_FILE_URL = '/api/file/list',//查询桶中的文件
  SHARE_FILE_URL = '/api/file/presignedUrl',//分享文件(即直接获取文件下载链接)
  CREATE_FOLDER_URL = '/api/file/createFolder',
  RENAME_FOLDER_URL = '/api/file/updateFolder',
  DELETE_FOLDER_URL = '/api/file/deleteFolder',
}

// export const getAllBuckets = ()=>request.get<any>(FILE_API.GET_ALL_BUCKET_URL)

export const deleteBucket = (bucketName:string)=>request.get<any>(FILE_API.DELETE_BUCKET_URL+`?bucketName=${bucketName}`)

export const uploadFile = (data:any)=>{
  return request.post<any>(FILE_API.UPLOAD_FILE_URL,data,{
    headers:{
      'Content-Type':'multipart/form-data'
    },
  })
}

export const downloadFile = (bucket:string,objectName:string)=>request.get<any>(FILE_API.DOWNLOAD_FILE_URL+`?bucket=${bucket}&objectName=${objectName}`,{responseType:'blob'})

export const deleteFile = (bucket:string,fileId:number,objectName:string)=>request.get<any>(FILE_API.DELETE_FILE_URL+`?bucket=${bucket}&fileId=${fileId}&objectName=${objectName}`)

export const getFileList = (bucket:string,path :string)=>request.get<any, fileResponse>(FILE_API.GET_FILE_URL + `?bucket=${bucket}&path=${path}`)

export const renameFile = (bucket:string,path:string,body:any)=> {
  const url:string = FILE_API.RENAME_FILE_URL + `?bucket=${bucket}&path=${path}`
  return request.post<any>(url,body)
}

export const shareFile = (bucket:string,objectName:string)=>request.get<any>(FILE_API.SHARE_FILE_URL+`?bucket=${bucket}&objectName=${objectName}`)

export const createFolder = (bucket:string,folderName:string,path:string)=>request.get<any>(FILE_API.CREATE_FOLDER_URL+`?bucket=${bucket}&folderName=${folderName}&path=${path}`)

export const renameFolder = (bucket:string,folderName:string,path:string,fileId:string)=>request.get<any>(FILE_API.RENAME_FOLDER_URL+`?bucket=${bucket}&folderName=${folderName}&path=${path}&fileId=${fileId}`)

export const deleteFolder = (fileId:string)=>request.get<any>(FILE_API.DELETE_FOLDER_URL+`?fileId=${fileId}`)