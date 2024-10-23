import { downloadFile } from '@/api/file'

/**
 * bucket: 文件所在bucket;
 * objectName: 路径 +文件名;
 * fileId: 文件id;
 * fileName: 下载文件的文件名;
 * */

export const downloadFileUtil  = async (bucket:string,objectName:string,fileId:number,fileName:string) =>{
  const result:any = await downloadFile(bucket,objectName,fileId)
  const url = window.URL.createObjectURL(new Blob([result]));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', fileName); // 设置下载的文件名
  document.body.appendChild(link);
  link.click(); // 触发下载
  link.remove(); // 下载完后移除链接
}