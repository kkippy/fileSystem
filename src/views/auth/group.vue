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
        <el-table-column align="center" prop="leader" label="创建人" width="150" />
        <el-table-column align="center" prop="memberCount" label="成员数量" width="110" >
          <template #default="{row}">
            <div style="display: flex; align-items: center">
              <SvgIcon :name="row.memberCount === 0 ? 'userInvalid' : 'userValid'" :width="45" :height="30" />
              <span style="margin-left: 10px">{{ row.memberCount }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="fileCount" label="文件数量" width="110" >
          <template #default="{row}">
            <div style="display: flex; align-items: center;margin: 0 auto">
              <SvgIcon :name="row.fileCount === 0 ? 'fileInvalid' : 'fileValid'" :width="45" :height="30" />
              <span style="margin-left: 10px">{{ row.fileCount }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="linkCount" label="链接数量" width="110" >
          <template #default="{row}">
            <div style="display: flex; align-items: center;margin: 0 auto">
              <SvgIcon :name="row.fileCount === 0 ? 'linkInvalid' : 'linkValid'" :width="45" :height="30" />
              <span style="margin-left: 10px">{{ row.linkCount }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="status" label="链接状态" width="150" >
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
        <el-table-column align="center" label="操作" >
          <template #default="{row}">
            <el-button type="primary" :icon="Edit" @click="handleEditGroup">编辑</el-button>
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

    <el-dialog title="新增群组" width="60%" v-model="addGroupVisible">
        <el-form ref="groupFormRef" style="width: 50%;" :rules="groupRules" :model="groupForm">
          <el-form-item label="群组名称" prop="groupName">
            <el-input  v-model="groupForm.groupName" placeholder="请输入群组名称" />
          </el-form-item>
        </el-form>

      <div class="tableContainer">
        <div class="leftTable">
          <el-button type="success" @click="handleAddGroupUser">添加用户</el-button>
          <el-button type="danger" style="margin-right: 10px;" @click="handleDelGroupUser" :disabled="deleteUserSelection.length === 0">删除</el-button>
          <el-input style="width: 50%;"  :suffix-icon="Search" placeholder="请输入用户名" v-model="searchUserName"></el-input>
          <el-table  border :data="userData" height="40vh" style="margin-top: 10px" @selection-change="handleGroupUserChange">
            <el-table-column align="center" type="selection" width="55" />
            <el-table-column align="center" label="姓名" prop="name" />
            <el-table-column align="center" label="工号" prop="number" />
          </el-table>
        </div>
        <div class="rightTable">
          <el-dropdown @command="handleCommand">
            <el-button type="success" >添加<el-icon class="el-icon--right"><ArrowDown /></el-icon></el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="file">文件</el-dropdown-item>
                <el-dropdown-item command="link">链接</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
          <el-button type="danger" style="margin:0 10px;" @click="handleDelGroupResource" :disabled="deleteFileSelection.length === 0 && deleteLinkSelection.length === 0 ">删除</el-button>
          <el-input style="width: 50%;" :suffix-icon="Search" placeholder="请输入链接名" v-model="searchLinkName" />
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
          <el-button @click="addGroupVisible = false">取消</el-button>
          <el-button type="primary" @click="submit">提交</el-button>
        </div>
      </template>
    </el-dialog>

    <el-dialog width="40%" v-model="userVisible">
      <template #header>
        <div style="display: flex;align-items: center">
          <span>选择用户</span>
          <el-input :suffix-icon="Search" style="margin-left: 10px;width: 40%;" placeholder="请输入姓名"></el-input>
        </div>
      </template>
      <el-table :data="selectUserData" height="40vh"
                @selection-change="handleSelectUserChange">
        <el-table-column align="center" type="selection" width="55" />
        <el-table-column align="center" label="姓名" prop="name" />
        <el-table-column align="center" label="工号" prop="number" />
        <el-table-column align="center" label="角色" prop="roleName" />
      </el-table>
      <el-pagination
        style="margin-top: 20px;"
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :size="size"
        :page-sizes="[20,50,100]"
        :background="true"
        layout="prev,pager,next,jumper,->,sizes,total"
        :total="userTotal"
        @size-change="handleUserSizeChange"
        @current-change="getGroupUser"
      />
      <template #footer>
        <div style="flex: auto">
          <el-button @click="userVisible = false">取消</el-button>
          <el-button type="primary" @click="handleCommitUser">提交</el-button>
        </div>
      </template>
    </el-dialog>

<!--    <el-dialog  width="40%" v-model="linkVisible">-->
<!--      <template #header>-->
<!--        <div style="display: flex;align-items: center">-->
<!--          <span>选择链接</span>-->
<!--          <el-input :suffix-icon="Search" style="margin-left: 10px;width: 40%;" placeholder="请输入链接名称" />-->
<!--        </div>-->
<!--      </template>-->
<!--      <el-table :data="selectLinkData" height="40vh"-->
<!--                @selection-change="handleSelectLinkChange">-->
<!--        <el-table-column align="center" type="selection" width="55" />-->
<!--        <el-table-column align="center" label="链接名" prop="linkName" />-->
<!--      </el-table>-->
<!--      <el-pagination-->
<!--        style="margin-top: 20px;"-->
<!--        v-model:current-page="currentPage"-->
<!--        v-model:page-size="pageSize"-->
<!--        :size="size"-->
<!--        :page-sizes="[20,50,100]"-->
<!--        :background="true"-->
<!--        layout="prev,pager,next,jumper,->,sizes,total"-->
<!--        :total="linkTotal"-->
<!--        @size-change="handleLinkSizeChange"-->
<!--        @current-change="getGroupLink"-->
<!--      />-->
<!--      <template #footer>-->
<!--        <div style="flex: auto">-->
<!--          <el-button @click="linkVisible = false">取消</el-button>-->
<!--          <el-button type="primary" @click="handleCommitLink">提交</el-button>-->
<!--        </div>-->
<!--      </template>-->
<!--    </el-dialog>-->
    <select-dialog
      v-model="linkVisible"
      title="选择链接"
      :data="selectLinkData"
      :columns="linkColumns"
      :total="linkTotal"
      placeholder="链接名称"
      @onCommit="handleCommitLink"
      @onClose="handleCloseLink"
      @onSizeChange="handleLinkSizeChange"
      @onCurrentChange="getGroupLink"
    />

    <el-dialog  width="40%" v-model="fileVisible">
      <template #header>
        <div style="display: flex;align-items: center">
          <span>选择文件</span>
          <el-input :suffix-icon="Search" style="margin-left: 10px;width: 40%;" placeholder="请输入文件名称" />
        </div>
      </template>
      <el-table :data="selectFileData" height="40vh"
                @selection-change="handleSelectFileChange">
        <el-table-column align="center" type="selection" width="55" />
        <el-table-column align="center" label="文件名" prop="fileName" />
        <el-table-column align="center" label="文件路径" prop="path" />
      </el-table>
      <el-pagination
        style="margin-top: 20px;"
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :size="size"
        :page-sizes="[20,50,100]"
        :background="true"
        layout="prev,pager,next,jumper,->,sizes,total"
        :total="linkTotal"
        @size-change="handleFileSizeChange"
        @current-change="getGroupFile"
      />
      <template #footer>
        <div style="flex: auto">
          <el-button @click="fileVisible = false">取消</el-button>
          <el-button type="primary" @click="handleCommitFile">提交</el-button>
        </div>
      </template>
    </el-dialog>


  </div>
</template>

<script setup lang="ts">
import { nextTick, reactive, ref,onMounted } from 'vue'
import HeaderComponent from '@/components/SearchHeader/index.vue'
import { Delete, Plus, Search,Edit,ArrowDown } from '@element-plus/icons-vue'
import SvgIcon from '@/components/SvgIcon/index.vue'
import type {ComponentSize,FormInstance} from "element-plus";
import SelectDialog from "@/components/SelectDialog/index.vue"
let size = ref<ComponentSize>('small')
let currentPage = ref<number>(1)
let pageSize = ref<number>(10)
let total = ref<number>(0)
//选择用户对话框的分页
let userTotal = ref<number>(0)
//选择链接对话框的分页
let linkTotal = ref<number>(0)
const loading = ref<boolean>(false)
const addGroupVisible = ref<boolean>(false)
const userVisible = ref<boolean>(false)
const fileVisible = ref<boolean>(false)
const linkVisible = ref<boolean>(false)
const searchUserName = ref<string>('')
const searchLinkName = ref<string>('')
const resourceType = ref<string>('file')
const groupFormRef = ref<FormInstance>()
//存储已选择的用户
const userSelection = ref([])
//存储选择删除用户的信息
const deleteUserSelection = ref([])
//存储选择删除文件的信息
const deleteFileSelection = ref([])
//存储已选择的链接
const linkSelection = ref([])
//存储已选择的文件
const fileSelection = ref([])
//存储选择删除链接的信息
const deleteLinkSelection = ref([])
const linkColumns = ref([
  { label: '链接名', prop: 'linkName' },
]);
//群组信息
const groupListData = ref([
  {
    id: 1,
    groupName: '测试小组',
    leader: 'admin',
    memberCount: 10,
    fileCount: 20,
    linkCount: 30,
    status: 1,
    updateTime: '2023-05-01 10:20:34'
  },
  {
    id: 2,
    groupName: '测试小组',
    leader: 'admin',
    memberCount: 0,
    fileCount: 20,
    linkCount: 0,
    status: 1,
    updateTime: '2023-05-01 10:20:34'
  },
  {
    id: 3,
    groupName: '测试小组',
    leader: 'admin',
    memberCount: 10,
    fileCount: 0,
    linkCount: 30,
    status: 1,
    updateTime: '2023-05-01 10:20:34'
  },
  {
    id: 4,
    groupName: '测试小组',
    leader: 'admin',
    memberCount: 10,
    fileCount: 20,
    linkCount:3,
    status: 0,
    updateTime: '2023-05-01 10:20:34'
  }
])
//选择用户对话框所用的数据
const selectUserData = ref([
  {
    id: 1,
    name: 'admin',
    number: '123456',
    roleName: '管理员',
  },
  {
    id: 2,
    name: 'ops1',
    number: '123456',
    roleName: '管理员',
  },
  {
    id: 3,
    name: 'ops2',
    number: '123456',
    roleName: '管理员',
  },
  {
    id: 4,
    name: 'ops3',
    number: '123456',
    roleName: '普通用户',
  },


])
//选择链接对话框所用的数据
const selectLinkData = ref([
  {
    id: 1,
    linkName: 'vue',
  },
  {
    id: 2,
    linkName: 'java',
  },
  {
    id: 3,
    linkName: 'php',
  },
  {
    id: 4,
    linkName: 'c++',
  },
  {
    id: 5,
    linkName: 'go',
  },
  {
    id: 6,
    linkName: 'python',
  }
])
//选择文件对话框所用的数据
const selectFileData = ref([
  {
    id: 1,
    fileName: 'vue',
    path: 'D:/vue'
  },
  {
    id: 2,
    fileName: 'java',
    path: 'D:/java'
  },
  {
    id: 3,
    fileName: 'php',
    path: 'D:/php'
  },
  {
    id: 4,
    fileName: 'c++',
    path: 'D:/c++'
  },
  {
    id: 5,
    fileName: 'go',
    path: 'D:/go'
  }
])
//群组成员
const userData = ref([
  {
    id: 1,
    name: '李文博',
    number: '123456'
  },
  {
    id: 2,
    name: '曹磊',
    number: '12345633'
  },
])
//群组链接
const linkData = ref([
  {
    id: 11,
    linkName: 'vue',
  },
  {
    id: 12,
    linkName: 'java',
  },
])
//群组文件
const fileData = ref([
  {
    id: 1,
    fileName: 'vue',
    path: 'D:/vue'
  },
  {
    id: 2,
    fileName: 'java',
    path: 'D:/java'
  },
])

const groupForm = reactive({
  groupName: '',
})

const validatorUserName = (rule:any, value:string, callback:any) => {
  if(value.trim().length === 0){
    callback(new Error("群组名不能为空"))
  }else{
    callback()
  }
}

const groupRules = reactive({
  groupName: [
    { required: true, validator: validatorUserName, trigger: 'blur' },
  ]
})

onMounted(() => {
  getGroup()
})

const getGroup = () => {
}

const onSearch =  (s:string) => {
  console.log(s)
}

const reset = () => {
}

const handleAddGroup = () => {
  console.log('handleAddGroup')
  nextTick(() => {
    groupFormRef.value?.resetFields()
  })
  addGroupVisible.value = true
}

const submit = async () => {
  console.log('confirmClick')
  await groupFormRef.value?.validate()
  addGroupVisible.value = false
}

const handleEditGroup = () => {
  console.log('handleEditGroup')
}

const handleDelGroup = (id:number) => {
  console.log(id)
}

const handleChangeLinkStatus = (row:any) => {
  // console.log(row)
}

const handleSizeChange = () => {
  currentPage.value = 1
  getGroup()
}

const handleAddGroupUser = () => {
  console.log('handleAddGroupUser')
  userVisible.value = true
}

const handleDelGroupUser = () => {
  userData.value = userData.value.filter(item=> {
    return  !deleteUserSelection.value.some((deleteItem:any)  =>{
      return  deleteItem.id === item.id
    })
  })
  deleteUserSelection.value = []
}

const handleCommand = (command: string)=>{
  if(command === 'file'){
    resourceType.value = 'file'
    handleAddGroupFile()
  }
  if(command === 'link'){
    resourceType.value = 'link'
    handleAddGroupLink()
  }
}

const handleAddGroupFile = () => {
  fileVisible.value = true
}

const handleAddGroupLink = () => {
  linkVisible.value = true
}

const handleDelGroupResource = () => {
  const dataToFilter = resourceType.value === 'link' ? linkData.value : fileData.value;
  const deleteSelection = resourceType.value === 'link' ? deleteLinkSelection.value : deleteFileSelection.value;

  const filteredData = dataToFilter.filter(item =>
    !deleteSelection.some(deleteItem => deleteItem.id === item.id)
  );

  if (resourceType.value === 'link') {
    linkData.value = filteredData;
    deleteLinkSelection.value = [];
  } else {
    fileData.value = filteredData;
    deleteFileSelection.value = [];
  }
}

const handleCommitUser = () => {
  userData.value = userSelection.value
  userVisible.value = false
}

const handleCommitLink = () => {
  console.log('handleCommitLink')
  linkData.value = linkSelection.value
  linkVisible.value = false
}

const handleCloseLink = (val) => {
  linkVisible.value = val
}

const handleCommitFile = () => {
  console.log('handleCommitFile')
  fileData.value = fileSelection.value
  fileVisible.value = false
}

const getGroupUser = async (pager = 1) => {
  currentPage.value = pager
}

const getGroupLink = async (pager = 1) => {
  currentPage.value = pager
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
  console.log('handleGroupFileChange')
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
  console.log('handleSelectLinkChange')
  linkSelection.value = val
}

const handleSelectFileChange = (val:any) => {
  console.log('handleSelectLinkChange')
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
