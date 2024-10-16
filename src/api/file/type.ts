export interface fileItem {
  fileName: string;
  lastModified: string; // ISO 8601 格式的日期字符串
  showName: string;
  size: string; // 如果 size 是数字，可以考虑将其类型改为 number
}

export type fileList = fileItem[];

export interface fileResponse {
  counts: number;
  items: fileItem[];
  pageNo: number;
  pageSize: number;
}