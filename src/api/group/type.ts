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
