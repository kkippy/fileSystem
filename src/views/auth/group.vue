<template>
  <div class="group-container">
    <el-card  body-class="cardStyle" style="border-radius: 10px">
      <header-component
        class="myHeader"
        placeholderTitle="群组名称"
        @onSearch="onSearch"
        @reset="reset"
      >
        <template #searchBtn>
          <el-button type="success" style="" :icon="Plus" @click="handleAddGroup">
            <span style="margin-left: 5px;">新增群组</span>
          </el-button>
        </template>
      </header-component>

      <el-table
        :data="groupListData"
        v-loading="loading"
        border
        height="65vh"
        style="width: 100%;"
        row-key="id"
      >
        <el-table-column align="center" type="index" label="序号" width="80" />
        <el-table-column align="center" prop="groupName" label="群组名称" />
        <el-table-column align="center" prop="userName" label="创建人" width="150" />
        <el-table-column align="center" prop="userNumber" label="成员数量" width="110" >
          <template #default="{row}">
            <div style="display: flex; align-items: center">
              <SvgIcon :name="row.memberCount === 0 ? 'userInvalid' : 'userValid'" :width="45" :height="30" />
              <span style="margin-left: 10px">{{ row.userNumber }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="fileNumber" label="文件数量" width="110" >
          <template #default="{row}">
            <div style="display: flex; align-items: center;margin: 0 auto">
              <SvgIcon :name="row.fileCount === 0 ? 'fileInvalid' : 'fileValid'" :width="45" :height="30" />
              <span style="margin-left: 10px">{{ row.fileNumber }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="linkNumber" label="链接数量" width="110" >
          <template #default="{row}">
            <div style="display: flex; align-items: center;margin: 0 auto">
              <SvgIcon :name="row.fileCount === 0 ? 'linkInvalid' : 'linkValid'" :width="45" :height="30" />
              <span style="margin-left: 10px">{{ row.linkNumber }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="status" label="链接状态" width="100" >
          <template #default={row}>
            <el-switch
              v-model="row.status"
              :active-value="0"
              :inactive-value="1"
              @change="handleChangeLinkStatus(row)"
              inline-prompt
              style="--el-switch-on-color: #13ce66;
              --el-switch-off-color: #ff4949"
              active-text="启用"
              inactive-text="禁用"
            />
          </template>
        </el-table-column>
        <el-table-column align="center" prop="updateTime" label="更新时间" width="200" />
        <el-table-column align="center" label="操作" width="200">
          <template #default="{row}">
            <el-button type="primary" :icon="Edit" @click="handleEditGroup(row)">编辑</el-button>
            <el-popconfirm
              :title="`确认删除${row.groupName}?`"
              width="200px"
              @confirm="handleDelGroup(row.id)"
            >
              <template #reference>
                <el-button type="danger" :icon="Delete">
                  删除
                </el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        style="margin-top: 20px;"
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :page-sizes="[20,50,100]"
        :background="true"
        layout="prev,pager,next,jumper,->,sizes,total"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="getGroup"
      />
    </el-card>

    <el-dialog :title="groupForm.id ? '编辑群组' : '新增群组'" width="60%" v-model="groupVisible">
        <el-form ref="groupFormRef" style="width: 52%;" :rules="groupRules" :model="groupForm">
          <el-form-item label="群组名称" prop="groupName">
            <el-input  v-model="groupForm.groupName" placeholder="请输入群组名称" />
          </el-form-item>
        </el-form>

      <div class="tableContainer">
        <div class="leftTable">
          <el-button type="success" @click="handleAddGroupUser">添加用户</el-button>
          <el-button type="danger"
                     style="margin-right: 10px;"
                     @click="handleDelGroupUser"
                     :disabled="deleteUserSelection.length === 0">删除</el-button>
          <el-input style="width: 50%;"
                    :suffix-icon="Search"
                    placeholder="请输入用户名"
                    v-model="searchUserName"
                    @keyup.enter="onSearchUser"
                    @clear="resetSearchUser"
                    clearable />
          <el-table  border :data="userData" height="40vh" style="margin-top: 10px" @selection-change="handleGroupUserChange">
            <el-table-column align="center" type="selection" width="55" />
            <el-table-column align="center" label="姓名" prop="name" />
            <el-table-column align="center" label="工号" prop="number" />
          </el-table>
        </div>
        <div class="rightTable">
          <el-cascader placeholder="选择资产类型"
                       :options="options"
                       style="width: 8vw"
                       v-model="selectBucket"
                       :show-all-levels="false"
                       @change="cascaderChange" />
          <el-button type="danger"
                     style="margin:0 10px;"
                     @click="handleDelGroupResource"
                     :disabled="deleteFileSelection.length === 0 && deleteLinkSelection.length === 0 ">删除</el-button>
          <el-input style="width: 50%;"
                    v-if=" resourceType === 'link'"
                    :suffix-icon="Search"
                    placeholder="请输入链接名"
                    v-model="searchLinkName"
                    @keyup.enter="onSearchLink"
                    clearable
                    @clear="resetSearchLink" />
          <el-input style="width: 40%;"
                    v-if=" resourceType === 'file'"
                    :suffix-icon="Search"
                    placeholder="请输入文件名"
                    v-model="searchFileName"
                    @keyup.enter="onSearchFile"
                    clearable
                    @clear="resetSearchFile" />
          <el-table v-if="resourceType === 'link'"  border :data="linkData" height="40vh" style="margin-top: 10px" @selection-change="handleGroupLinkChange" >
            <el-table-column align="center" type="selection" width="55" />
            <el-table-column align="center" label="链接名" prop="linkName" />
          </el-table>
          <el-table v-else border :data="fileData" height="40vh" style="margin-top: 10px" @selection-change="handleGroupFileChange">
            <el-table-column align="center" type="selection" width="55" />
            <el-table-column align="center" label="文件名" prop="fileName" />
            <el-table-column align="center" label="文件路径" prop="path" />
          </el-table>
        </div>
      </div>

      <template #footer>
        <div style="flex: auto">
          <el-button @click="groupVisible = false">取消</el-button>
          <el-button type="primary" @click="submit">提交</el-button>
        </div>
      </template>
    </el-dialog>

    <select-dialog
      v-model="userVisible"
      title="选择用户"
      :data="selectUserData"
      :columns="userColumns"
      :total="userTotal"
      placeholder="请输入用户名称"
      @onCommit="handleCommitUser"
      @search-change="handleSearchUser"
      @select-change="handleSelectUserChange"
      @size-change="handleUserSizeChange"
      @current-change="getGroupUser"
      :current-page="groupUserCurrentPage"
      :page-size="groupUserPageSize"
    />

    <select-dialog
      v-model="linkVisible"
      title="选择链接"
      :data="selectLinkData"
      :columns="linkColumns"
      :total="linkTotal"
      placeholder="请输入链接名称"
      @onCommit="handleCommitLink"
      @search-change="handleSearchLink"
      @select-change="handleSelectLinkChange"
      @size-change="handleLinkSizeChange"
      @current-change="getGroupLink"
      :current-page="groupLinkCurrentPage"
      :page-size="groupLinkPageSize"
    />

    <select-dialog
      v-model="fileVisible"
      title="选择文件"
      :data="selectFileData"
      :columns="fileColumns"
      :total="fileTotal"
      placeholder="请输入文件名称"
      @onCommit="handleCommitFile"
      @search-change="handleSearchFile"
      @select-change="handleSelectFileChange"
      @size-change="handleFileSizeChange"
      @current-change="getGroupFile"
      :current-page="groupFileCurrentPage"
      :page-size="groupFilePageSize"
    />

  </div>
</template>

<script setup lang="ts">
import { nextTick, reactive, ref, onMounted, watch } from 'vue'
import HeaderComponent from '@/components/SearchHeader/index.vue'
import { Delete, Plus, Search,Edit } from '@element-plus/icons-vue'
import SvgIcon from '@/components/SvgIcon/index.vue'
import { ElMessage, type FormInstance } from 'element-plus'
import SelectDialog from "@/components/SelectDialog/index.vue"
import type {
  IUser,
  ILink,
  IFile,
  groupListItem,
  groupResponseData,
  addGroupResponseData,
  IGroupForm,
  searchGroupResponseData,
  searchLinkListItem,
  searchFileListItem
} from '@/api/group/type'
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
import {searchUser} from "@/api/user"
import {getLinks} from "@/api/link"
import {searchFile} from "@/api/file"
import type { linkResponseData } from '@/api/link/type'
import { options,userColumns,fileColumns,linkColumns } from '@/utils/groupTools'
let currentPage = ref<number>(1)
let groupUserCurrentPage = ref<number>(1)
let groupLinkCurrentPage = ref<number>(1)
let groupFileCurrentPage = ref<number>(1)
let pageSize = ref<number>(10)
let groupUserPageSize = ref<number>(10)
let groupLinkPageSize = ref<number>(10)
let groupFilePageSize = ref<number>(10)
let total = ref<number>(0)
//选择用户对话框的分页
let userTotal = ref<number>(0)
//选择链接对话框的分页
let linkTotal = ref<number>(0)
//选择文件对话框的分页
let fileTotal = ref<number>(0)
const loading = ref<boolean>(false)
const groupVisible = ref<boolean>(false)
const userVisible = ref<boolean>(false)
const fileVisible = ref<boolean>(false)
const linkVisible = ref<boolean>(false)
const searchUserName = ref<string>('')
const searchLinkName = ref<string>('')
const searchFileName = ref<string>('')
const resourceType = ref<string>('file')
const delUserIds = ref<any[]>([])
const addUserIds = ref<any[]>([])
const groupFormRef = ref<FormInstance>()
const selectBucket = ref([])
//存储已选择的用户
const userSelection = ref([])
//存储选择删除用户的信息
const deleteUserSelection = ref([])
//存储已选择的文件
const fileSelection = ref([])
//存储选择删除文件的信息
const deleteFileSelection = ref([])
//存储已选择的链接
const linkSelection = ref([])
//存储选择删除链接的信息
const deleteLinkSelection = ref([])
//群组信息
const groupListData = ref<groupListItem[]>([])
//选择用户对话框所用的数据
const selectUserData = ref<IUser[]>([])
//选择链接对话框所用的数据
const selectLinkData = ref<ILink[]>([])
//选择文件对话框所用的数据
const selectFileData = ref<IFile[]>([])
//群组成员
const userData = ref<IUser[]>([])
const originUserData = ref<IUser[]>([])
//群组链接
const linkData = ref<ILink[]>([])
const originLinkData = ref<ILink[]>([])
//群组文件
const fileData = ref<IFile[]>([])
const originFileData = ref<IFile[]>([])
const groupForm = reactive<IGroupForm>({
  groupName: '',
})
const bucketName = ref<string>('')

const validatorUserName = (rule:any, value:string, callback:any) => {
  if(value.trim().length === 0){
    callback(new Error("群组名不能为空"))
  }else{
    callback()
  }
}

watch([searchUserName,searchLinkName,searchFileName],()=>{
  if(searchUserName.value === ''){
    resetSearchUser()
  }
  if(searchLinkName.value === ''){
    resetSearchLink()
  }
  if(searchFileName.value === ''){
    resetSearchFile()
  }
})

const groupRules = reactive({
  groupName: [
    { required: true, validator: validatorUserName, trigger: 'blur' },
  ]
})

onMounted(() => {
  getGroup()
})

const getGroup = async (pager = 1) => {
  currentPage.value = pager
  const {data}:groupResponseData = await getGroupList(currentPage.value,pageSize.value)
  groupListData.value = data.items
  total.value = data.counts
}

const onSearch = async (searchValue:string) => {
  const {data}:groupResponseData = await getGroupList( currentPage.value,
    pageSize.value,{groupName:searchValue} )
  groupListData.value = data.items
  total.value = data.counts
}

const reset = () => {
  getGroup()
}

const onSearchUser = async ()=>{
  userData.value = userData.value.filter(item => item.name.includes(searchUserName.value))
}

const handleSearchUser = async (searchValue:string) => {
  const result:any = await searchUser(groupUserCurrentPage.value,groupUserPageSize.value,{
    name:searchValue
  })
  selectUserData.value = result.items
  userTotal.value = result.counts
}

const onSearchLink = async () => {
  linkData.value = linkData.value.filter(item => item.linkName.includes(searchLinkName.value))
}

const handleSearchLink = async (searchValue:string) => {
  const { data }:linkResponseData = await getLinks(groupLinkCurrentPage.value,groupLinkPageSize.value,{
    linkName:searchValue
  })
  selectLinkData.value = data.items
  linkTotal.value = data.counts
}

const onSearchFile = async () => {
  fileData.value = fileData.value.filter(item => item.fileName.includes(searchFileName.value))
}

const handleSearchFile = async (searchValue:string) => {
  const result:any = await searchFile(bucketName.value,groupFileCurrentPage.value,groupFilePageSize.value,{
    fileName:searchValue
  })
  selectFileData.value = result.data.items
  fileTotal.value = result.data.counts
}

const resetSearchUser = ()=>{
  userData.value = [...originUserData.value]
}

const resetSearchLink = ()=>{
  linkData.value = [...originLinkData.value]
}

const resetSearchFile = ()=>{
  fileData.value = [...originFileData.value]
}

const handleAddGroup = () => {
  nextTick(() => {
    groupFormRef.value?.resetFields()
    userData.value = []
    linkData.value = []
    fileData.value = []
    selectBucket.value = []
    groupForm.id = null
    groupForm.groupName = ''
  })
  groupVisible.value = true
}

const submit = async () => {
  const userParams = userData.value.map(item => item.id)
  const fileParams = fileData.value.map(item => item.id)
  const linkParams = linkData.value.map(item => item.id)
  try{
    if(groupForm.id){
      await Promise.all([
        // addGroupUser(groupForm.id, userParams),
        addGroupFile(groupForm.id, fileParams),
        addGroupLink(groupForm.id, linkParams)
      ])
      if(delUserIds.value.length && delUserIds.value  ){
        console.log(delUserIds.value,'1')
        await deleteGroupUser(groupForm.id,delUserIds.value)
      }
      if(addUserIds.value.length && addUserIds.value  ){
        await addGroupUser(groupForm.id,addUserIds.value)
      }
      const result:any = await updateGroup(groupForm.id,{
        id: groupForm.id,
        groupName: groupForm.groupName
      });
      ElMessage({
        message: result.code === 200 ? '修改成功' : result.msg,
        type: result.code === 200 ? 'success' :'error'
      });
    } else {
      await groupFormRef.value?.validate()
      const result: addGroupResponseData =await addGroup(groupForm.groupName)
      const groupId = result.data.id
      await Promise.all([
        addGroupUser(groupId, userParams),
        addGroupFile(groupId, fileParams),
        addGroupLink(groupId, linkParams)
      ])
      ElMessage({
        message: result.code === 200 ? '添加成功' : result.msg,
        type: result.code === 200 ? 'success' : 'error'
      })
    }
  } catch (e){
    console.log(e,'e')
  } finally {
    delUserIds.value = []
    addUserIds.value = []
    await getGroup()
    groupVisible.value = false
  }
}

const handleEditGroup = async (row:any) => {
  Object.assign(groupForm,row)
  const result:searchGroupResponseData = await searchGroup(row.id)
  userData.value = result.data.userList
  linkData.value = result.data.linkList as unknown as searchLinkListItem[]
  fileData.value = result.data.fileInfoList as unknown as searchFileListItem[]
  groupVisible.value = true
}

const handleDelGroup = async (id:number) => {
  const result:any = await deleteGroup(id)
  ElMessage({
    message: result.msg,
    type: result.code === 200 ? 'success' : 'error'
  })
  await getGroup()
}

const handleChangeLinkStatus = async (row:any) => {
  const result:any = await updateGroup(row.id as number,{
    id:row.id,
    status:row.status
  })
  ElMessage({
    message: result.code === 200 ? '状态修改成功': result.msg,
    type: result.code === 200 ? 'success' : 'error'
  })
  await getGroup()
}

const handleSizeChange = () => {
  currentPage.value = 1
  getGroup()
}

const handleAddGroupUser = async () => {
  await nextTick(() => {
    userVisible.value = true
  })
  const result:any = await searchUser(groupUserCurrentPage.value,groupUserPageSize.value,{
    roleName:'普通用户'
  })
  selectUserData.value = result.items.filter((item:any) => !userData.value.some(userItem => userItem.id === item.id))
  userTotal.value = result.counts
}

const handleDelGroupUser = async () => {
   originUserData.value = userData.value
  deleteUserSelection.value.map((item:any) => item.id).forEach(id => {
    if(originUserData.value.map(item => item.id).includes(id)){
      delUserIds.value.push(id)
    }
  })
  userData.value = userData.value.filter(item=> {
    return  !deleteUserSelection.value.some((deleteItem:any)  =>{
      return  deleteItem.id === item.id
    })
  })
  deleteUserSelection.value = []
}

const cascaderChange = async () => {
  if(selectBucket.value.length > 1){
    resourceType.value = 'file'
    bucketName.value = selectBucket.value[selectBucket.value.length - 1]
    const bucketTranslations:Record<string, string> = {
      'basic': '基础架构室',
      'support': '开发支持室',
      'section1': '信息化一室',
      'section2': '信息化二室',
      'manage': '综合管理室',
    }
    const result:any = await searchFile(bucketName.value,groupFileCurrentPage.value,groupFilePageSize.value)
    fileVisible.value = true
    selectFileData.value = result.data.items.map((item:any) => {
      if(bucketTranslations[item.bucket]){
        item.bucket = bucketTranslations[item.bucket]
      }
      return item
    })
    fileTotal.value = result.data.counts
  } else {
    resourceType.value = 'link'
    await handleAddGroupLink()
  }
}

const handleAddGroupLink = async () => {
  linkVisible.value = true
  const result:linkResponseData = await getLinks(groupLinkCurrentPage.value,groupLinkPageSize.value)
  selectLinkData.value = result.data.items
  linkTotal.value = result.data.counts
}

const handleDelGroupResource = async () => {
  const dataToFilter = resourceType.value === 'link' ? linkData.value : fileData.value;
  const deleteSelection = resourceType.value === 'link' ? deleteLinkSelection.value : deleteFileSelection.value;

  const filteredData:(ILink | IFile)[] = dataToFilter.filter((item:any) =>
    !deleteSelection.some((deleteItem:any) => deleteItem.id === item.id)
  );

  if (resourceType.value === 'link') {
    const delLinkIds = deleteLinkSelection.value.map((item:any) => item.id);
    await deleteGroupLink(groupForm.id as number, delLinkIds);
    linkData.value = filteredData as ILink[];
    deleteLinkSelection.value = [];
  } else {
    const delFileIds = deleteFileSelection.value.map((item:any) => item.id);
    await deleteGroupFile(groupForm.id as number, delFileIds);
    fileData.value = filteredData as IFile[];
    deleteFileSelection.value = [];
  }
}

const handleCommitUser = (val:boolean) => {
  originUserData.value = userData.value
  const merge = [...userData.value,...userSelection.value]
  userData.value = Array.from(new Set(merge.map(item => item.id))).map(id => merge.find(item => item.id === id)) as unknown as IUser[]
  console.log(originUserData.value,'originUserData')
  userSelection.value.map((item:any) => item.id).forEach(id => {
    if(userData.value.map(item => item.id).includes(id)){
      addUserIds.value.push(id)
    }
  })
  // addUserIds.value = userSelection.value.map((item:any) => item.id)
  userVisible.value = val
}

const handleCommitLink = (val:boolean) => {
  linkData.value = linkSelection.value
  originLinkData.value = [...linkSelection.value]
  linkVisible.value = val
  selectBucket.value = []
}

const handleCommitFile = (val:boolean) => {
  fileData.value = fileSelection.value
  originFileData.value = [...fileSelection.value]
  fileVisible.value = val
  selectBucket.value = []
}

const getGroupUser = async (page = 1) => {
  groupUserCurrentPage.value = page
  const result:any = await searchUser(groupUserCurrentPage.value,groupUserPageSize.value,{
    roleName:'普通用户'
  })
  selectUserData.value = result.items.filter((item:any) => !userData.value.some(userItem => userItem.id === item.id))
  userTotal.value = result.counts
}

const getGroupLink = async (pager = 1) => {
  groupLinkCurrentPage.value = pager
  const result:linkResponseData = await getLinks(groupLinkCurrentPage.value,groupLinkPageSize.value)
  selectLinkData.value = result.data.items
  linkTotal.value = result.data.counts
}

const getGroupFile = async (pager = 1) => {
  currentPage.value = pager
}

const handleGroupUserChange = (val:any) => {
  deleteUserSelection.value = val
}

const handleGroupLinkChange = (val:any) => {
  deleteLinkSelection.value = val
}

const handleGroupFileChange = (val:any) => {
  deleteFileSelection.value = val
}

const handleUserSizeChange = () => {
  currentPage.value = 1
  getGroupUser()
}

const handleLinkSizeChange = () => {
  currentPage.value = 1
  getGroupLink()
}

const handleFileSizeChange = () => {
  currentPage.value = 1
  getGroupFile()
}

const handleSelectUserChange = (val:any) => {
  userSelection.value = val
}

const handleSelectLinkChange = (val:any) => {
  linkSelection.value = val
}

const handleSelectFileChange = (val:any) => {
  fileSelection.value = val
}


</script>

<style scoped lang="scss">
.group-container{
  :global(.cardStyle){
    border-radius: 10px;
    padding-top: 0;
  }
  .myHeader {
    box-shadow: none;
  }

  .tableContainer{
    display: flex;
    justify-content: space-between;
    .leftTable{
      flex: .48;
    }
    .rightTable{
      flex: .48;
    }
  }
}
</style>
