import { downloadFile,uploadFile } from '@/api/file'
export const downloadFileUtil  = async (bucket:string,showName:string,fileName:string) =>{
  const result:any = await downloadFile(bucket,showName)
  const url = window.URL.createObjectURL(new Blob([result]));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', fileName); // 设置下载的文件名
  document.body.appendChild(link);
  link.click(); // 触发下载
  link.remove(); // 下载完后移除链接
}