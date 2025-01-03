interface ResponseData {
  code: number;
  msg: string;
}

export interface getViewInfo {
  userName?: string;
  userNumber?: string;
}

export interface getUploadInfo {
  uploadName?: string;
  uploadType?: 'file' | 'link';
}

export interface getGroupInfo {
  userName?: string;
  groupName?: string;
}

export interface getDownloadInfo {
  userName?: string;
  fileName?: string;
}

interface getViewInfoItem {
  userName: string;
  userNumber: string;
  loginTime: string;
}

type getViewInfoList = getViewInfoItem[];

export interface getViewInfoResponseData extends ResponseData {
  data: {
    counts: number;
    pageNo: number;
    pageSize: number;
    items: getViewInfoList;
  };
}

interface getUploadInfoItem {
  uploadName: string;
  uploadType: string;
  userName: string;
  uploadTime: string;
}

type getUploadInfoList = getUploadInfoItem[];

export interface getUploadInfoResponseData extends ResponseData {
  data: {
    counts: number;
    pageNo: number;
    pageSize: number;
    items: getUploadInfoList;
  };
}

interface getDownloadInfoItem {
  fileName: string;
  fileSize: string;
  userName: string;
  downloadTime: string;
}

type getDownloadInfoList = getDownloadInfoItem[];

export interface getDownloadInfoResponseData extends ResponseData {
  data: {
    counts: number;
    pageNo: number;
    pageSize: number;
    items: getDownloadInfoList;
  };
}

export interface getGroupInfoItem {
  userName: string;
  groupName: string;
  createTime: string;
}

type getGroupInfoList = getGroupInfoItem[];

export interface getGroupInfoResponseData extends ResponseData {
  data: {
    counts: number;
    pageNo: number;
    pageSize: number;
    items: getGroupInfoList;
  };
}

export interface getCapacityResponseData extends ResponseData {
  data: {
    totalCapacity: string
    usedCapacity:string
    freeCapacity:string
  };
}

export interface getScrollItem {
  department:string,
  fileCount:number,
  linkCount:number,
  usedCapacity:string
}

 type getScrollList = getScrollItem[]

export interface getScrollListResponseData extends ResponseData {
  data: getScrollList
}

export interface getLineChartResponseData extends ResponseData {
  data: {
    downloadList:number[],
    uploadList:number[],
    loginList:number[],
    dateList:string[]
  }
}

export interface getBarChartResponseData extends ResponseData {
  data: {
    imageCount:number,
    videoCount:number,
    pdfCount:number,
    wordCount:number,
    excelCount:number,
    pptCount:number,
    otherCount:number
  }
}

export interface propListItem {

}



