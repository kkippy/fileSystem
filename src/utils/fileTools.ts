import { downloadFile } from '@/api/file'
import { ElMessage } from 'element-plus'
const pictureType:string[] = ['png','jpg','jpeg','psd','gif','bmp','webp','svg']
const compressType:string[] = ['zip','rar','7z','jar','gzip','tar','gz']
const videoType:string[] = ['mp4','mov','flv','avi','wav']
const documentType:string[] = ['txt','doc','docx','avi','dotx','wps','dps']
const excelType:string[] = ['xlsx','xlsm','xlsb','xltx','csv','tsv','xla','xls']
/**
 * bucket: 文件所在bucket;
 * objectName: 路径 +文件名;
 * fileId: 文件id;
 * fileName: 下载文件的文件名;
 * */

export const downloadFileUtil  = async (bucket:string,objectName:string,fileId:number,fileName:string) =>{
  const result:any = await downloadFile(bucket,objectName,fileId)
  console.log('result',result)
  if(result === 600){
    return ElMessage({
      type: 'error',
      message: "抱歉！您没有相应的权限！"
    })
  }
  const url = window.URL.createObjectURL(new Blob([result]));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', fileName); // 设置下载的文件名
  document.body.appendChild(link);
  link.click(); // 触发下载
  link.remove(); // 下载完后移除链接
}

export const isSpecialFileType  = (fileType:string,type:string):boolean => {
  const lowerCaseFileType  = fileType.toLowerCase()
  const fileTypes:Record<string, string[]> = {
    picture: pictureType,
    compress: compressType,
    video: videoType,
    document: documentType,
    excel: excelType
  };
  return fileTypes[type].includes(lowerCaseFileType );
}
