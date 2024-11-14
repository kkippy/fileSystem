import type {IUser,ILink,IFile} from '@/api/group/type'
import {
  getGroupList,
  addGroup,
  searchGroup,
  updateGroup,
  deleteGroup,
  addGroupUser,
  addGroupFile,
  addGroupLink,
  deleteGroupUser,
  deleteGroupFile,
  deleteGroupLink
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

export const bucketTranslations:Record<string, string> = {
  'basic': '基础架构室',
  'support': '开发支持室',
  'section1': '信息化一室',
  'section2': '信息化二室',
  'manage': '综合管理室',
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

export const handleCommitResource = async (groupId:number,val:boolean,type:'file' | 'link',data:{ value: any[] },originData: { value: any[] },selection:{ value: any[] },visible:{ value: boolean }) => {
  console.log(selection.value,'selection')
  const addIds = selection.value.map((item:any) => item.id)
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
    visible.value = val;
    if (result.code !== 200) return;
    data.value = [...data.value, ...selection.value];
    originData.value = [...data.value, ...selection.value];
  console.log(data.value,'1')
}