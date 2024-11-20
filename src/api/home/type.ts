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
    items: getViewInfoList;
    counts: number;
    pageNo: number;
    pageSize: number;
  };
}
