export interface fileItem {
  bucket: string;          // 存储桶名称
  createTime: string;     // 创建时间
  fileDepth: number;      // 文件深度
  fileName: string;       // 文件名
  fileSize: number | null; // 文件大小，可能为 null
  id: number;             // 文件 ID
  isDir: number;         // 是否为目录，1 表示是，0 表示否
  isImg: number;         // 是否为图片，1 表示是，0 表示否
  parentId: number;      // 父级 ID
  path: string;          // 文件路径
  presignedUrl: string | null; // 预签名 URL，可能为 null
  status: number;        // 状态
  suffixName: string | null; // 后缀名，可能为 null
  timeName: string;      // 时间名称
  updateTime: string;    // 更新时间
  userId: number;        // 用户 ID
  isEditing?: boolean;
  isPreview?: boolean;
}

export type fileList = fileItem[];

export interface fileResponse {
  code: number;
  msg:string
  data:fileList
}