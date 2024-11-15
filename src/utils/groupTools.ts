import type { IUser, ILink, IFile, searchGroupResponseData, searchFileListItem } from '@/api/group/type'
import {
  searchGroup,
  addGroupFile,
  addGroupLink,
} from '@/api/group'
import { ElMessage } from 'element-plus'

export const userColumns  = [
  { label: '姓名', prop: 'name' },
  { label: '工号', prop: 'number' },
  { label: '角色', prop: 'roleName' },
]

export const fileColumns = [
  { label: '文件名', prop: 'fileName' },
  { label: '科室', prop: 'bucket' },
  { label: '文件路径', prop: 'path' },
]

export const linkColumns  = [
  { label: '链接名', prop: 'linkName' },
]

export function  resetIfEmpty(input:any, resetFunction:Function):void {
  if (input.value === '') {
    resetFunction();
  }
}

export const handleCommit = (
  val: boolean,
  data: { value: any[] },
  selection: { value: any[] },
  originData: { value: any[] },
  addIds: { value: any[] },
  visible: { value: boolean }
) => {
  // 保存原始数据
  originData.value = data.value;

  // 合并并去重
  const merge = [...data.value, ...selection.value];
  data.value = Array.from(new Set(merge.map(item => item.id)))
    .map(id => merge.find(item => item.id === id)) as unknown as (IUser | ILink | IFile)[];

  // 添加 ID
  selection.value.map((item: any) => item.id).forEach(id => {
    if (data.value.map(item => item.id).includes(id)) {
      addIds.value.push(id);
    }
  });

  // 更新可见性
  visible.value = val;
};

export const handleCommitResource = async (
  groupId:number,
  val:boolean,
  type:'file' | 'link',
  data:{value: any[] },
  selection:  any[]  ,
  visible:  { value: boolean }
) => {
  console.log(selection,'selection')
  const addIds = selection.map((item:any) => item.id)
  let result:any

    if(type === 'link'){
      console.log(addIds,'addIds')
      result = await addGroupLink(groupId, addIds);
    } else {
      result = await addGroupFile(groupId, addIds);
    }
    ElMessage({
      message: result.code === 200 ? '添加成功' : result.msg,
      type: result.code === 200 ? 'success' : 'error'
    });
    visible.value  = val;
    if (result.code !== 200) return;
    const result1:searchGroupResponseData = await searchGroup(groupId)
    data.value = result1.data.fileInfoList
}
