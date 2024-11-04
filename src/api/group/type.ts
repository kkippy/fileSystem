//定义三个群组数据类型
export interface IUser {
  id: number;
  name: string;
  number: number | string;
  roleName?: string;
}

export interface ILink {
  id: number;
  linkName: string;
}

export interface IFile {
  id: number;
  fileName: string;
  path?: string;
}

export interface ResponseData {
  code: number;
  msg: string;
}

export interface searchUserListItem {
  id: number;
  number: number | string;
  account: string;
  name: string;
  userStatus: number;
  createTime: string;
  updateTime: string;
}

export interface searchLinkListItem {
  id: number;
  linkName: string;
  linkAddress: string;
  status: number;
  hasGroup: number;
  userId: number;
  createTime: string;
  updateTime: string;
}

export interface searchFileListItem {
  id: number;
  parentId: number;
  bucket: string;
  fileName: string;
  timeName: string;
  suffixName: string;
  isDir: number;
  isImg: number;
  fileSize: string;
  fileDepth: number;
  status: number;
  hasGroup: number;
  createTime: string;
  updateTime: string;
  userId: number;
}

export interface groupListItem {
  id: number;
  groupName: string;
  status: number;
  createTime: string;
  updateTime: string;
  userId: number;
  userName: string;//创建人
  userNumber: number | null;
  fileNumber: number | null;
  linkNumber: number | null;
}

export interface searchGroupItem extends groupListItem {
  userList: searchUserListItem[];
  fileInfoList: searchLinkListItem[];
  linkList: searchFileListItem[];
 }

export type groupList = groupListItem[];

 export interface groupResponseData extends ResponseData {
  data: {
    items: groupList;
    counts: number;
    pageNo: number;
    pageSize: number;
  };
 }

 export interface addGroupResponseData extends ResponseData {
  data: groupListItem
 }

 export interface IGroupForm{
   id?: number | null;
   groupName: string;
 }

 export interface searchGroupResponseData extends ResponseData {
  data: searchGroupItem
 }
