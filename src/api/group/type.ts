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
  path: string;
}

export interface ResponseData {
  code: number;
  msg: string;
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
