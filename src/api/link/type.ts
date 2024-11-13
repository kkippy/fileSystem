export interface  ResponseData {
  code: number;
  msg: string;
}

//获取链接列表
export interface Item {
  id: number;
  linkName: string;
  linkAddress?: string; // 注意：这里的链接地址是字符串类型
  status: number;
  hasGroup: number;
  createTime: string; // 可以考虑使用 Date 类型，但这里保持为 string
  updateTime: string; // 同上
  userId: number;
}

export type linkListItem = Item[];

export interface linkFormFormat {
  id?: number;
  linkName:string;
  linkAddress:string,
  department:string
}


//定义链接列表数据部分的类型
export interface linkResponseData extends ResponseData{
  data:{
    items: linkListItem;
    counts: number;
    pageNo: number;
    pageSize: number;
  }
}

export interface searchResponseData extends ResponseData{
  data: Item
}





