interface ResponseData {
  code: number;
  msg: string;
}

export interface getViewInfo {
  userName: string;
  userNumber: string;
}

export interface getUploadInfo {
  uploadName: string;
  uploadType: 'file' | 'link';
}

export interface getGroupInfo {
  userName: string;
  groupName: string;
}

export interface getDownloadInfo {
  userName: string;
  fileName: string;
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



