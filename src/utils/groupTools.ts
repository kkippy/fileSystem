export const options = [
  {
    value: 'file',
    label: '文件',
    children:[
      {
        value: 'section1',
        label: '信息化一室',
      },
      {
        value: 'section2',
        label: '信息化二室',
      },
      {
        value: 'basic',
        label: '基础架构室',
      },
      {
        value: 'support',
        label: '开发支持室',
      },
      {
        value: 'manage',
        label: '综合管理室',
      }
    ]
  },
  {
    value: 'link',
    label: '链接',
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
