export const options = [
  {
    value: 'file',
    label: '文件',
    children:[
      {
        value: 'section1',
        label: '信息化一室文件',
      },
      {
        value: 'section2',
        label: '信息化二室文件',
      },
      {
        value: 'basic',
        label: '基础架构室文件',
      },
      {
        value: 'support',
        label: '开发支持室文件',
      },
      {
        value: 'manage',
        label: '综合管理室文件',
      }
    ]
  },
  {
    value: 'link',
    label: '链接',
    children:[
      {
        value: 'section1',
        label: '信息化一室链接',
      },
      {
        value: 'section2',
        label: '信息化二室链接',
      },
      {
        value: 'basic',
        label: '基础架构室链接',
      },
      {
        value: 'support',
        label: '开发支持室链接',
      },
      {
        value: 'manage',
        label: '综合管理室链接',
      },
    ]
  },
]

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
