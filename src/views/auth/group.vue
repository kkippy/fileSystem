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
        :data="roleListData"
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
              v-model="row.userStatus"
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
        <el-table-column align="center" prop="updateTime" label="更新时间" width="150" />
        <el-table-column align="center" label="操作" >
          <template #default="{row}">
            <el-button type="warning" @click="handleEditGroup">编辑</el-button>
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
    </el-card>

    <el-dialog title="新增群组" width="60%" v-model="addGroupVisible">
        <el-form style="width: 80%;">
          <el-form-item label="群组名称" >
            <el-input  v-model="groupName" placeholder="请输入群组名称" />
          </el-form-item>
        </el-form>

      <div class="tableContainer">
        <div class="leftTable">
          <el-button type="success" @click="handleAddGroupUser">添加用户</el-button>
          <el-button type="danger" style="margin-right: 10px;">删除用户</el-button>
          <el-input style="width: 50%;"  :suffix-icon="Search" placeholder="请输入用户名" v-model="searchUserName"></el-input>
          <el-table  border :data="userData" height="40vh" style="margin-top: 10px">
            <el-table-column align="center" type="selection" width="55" />
            <el-table-column align="center" label="姓名" prop="username" />
            <el-table-column align="center" label="用户名" prop="account" />
          </el-table>
        </div>
        <div class="rightTable">
          <el-button type="success" @click="handleAddGroupLink">添加链接</el-button>
          <el-button type="danger" style="margin-right: 10px;">删除链接</el-button>
          <el-input style="width: 50%;" :suffix-icon="Search" placeholder="请输入链接名" v-model="searchLinkName"></el-input>
          <el-table  border :data="linkData" height="40vh" style="margin-top: 10px">
            <el-table-column align="center" type="selection" width="55" />
            <el-table-column align="center" label="链接名" prop="linkName" />
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

    <el-dialog title="选择用户" width="60%" v-model="userVisible">
      <el-table :data="selectUserData" height="40vh">
        <el-table-column align="center" type="selection" width="55" />
        <el-table-column align="center" label="姓名" prop="username" />
        <el-table-column align="center" label="用户名" prop="account" />
      </el-table>
      <template #footer>
        <div style="flex: auto">
          <el-button @click="userVisible = false">取消</el-button>
          <el-button type="primary" @click="handleCommitUser">提交</el-button>
        </div>
      </template>
    </el-dialog>

    <el-dialog title="选择链接" width="60%" v-model="linkVisible">
      <el-table :data="selectLinkData" height="40vh">
        <el-table-column align="center" type="selection" width="55" />
        <el-table-column align="center" label="链接名" prop="linkName" />
      </el-table>
      <template #footer>
        <div style="flex: auto">
          <el-button @click="linkVisible = false">取消</el-button>
          <el-button type="primary" @click="handleCommitLink">提交</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import HeaderComponent from '@/components/SearchHeader/index.vue'
import { Delete, Plus, Search } from '@element-plus/icons-vue'
import SvgIcon from '@/components/SvgIcon/index.vue'


const loading = ref<boolean>(false)
const addGroupVisible = ref<boolean>(false)
const userVisible = ref<boolean>(false)
const linkVisible = ref<boolean>(false)
const groupName = ref<string>('')
const searchUserName = ref<string>('')
const searchLinkName = ref<string>('')
const roleListData = ref([
  {
    id: 1,
    groupName: '测试小组',
    leader: 'admin',
    memberCount: 10,
    fileCount: 20,
    linkCount: 30,
    createTime: '2023-05-01',
    updateTime: '2023-05-01'
  },
  {
    id: 2,
    groupName: '测试小组',
    leader: 'admin',
    memberCount: 0,
    fileCount: 20,
    linkCount: 0,
    createTime: '2023-05-01',
    updateTime: '2023-05-01'
  },
  {
    id: 3,
    groupName: '测试小组',
    leader: 'admin',
    memberCount: 10,
    fileCount: 0,
    linkCount: 30,
    createTime: '2023-05-01',
    updateTime: '2023-05-01'
  },
  {
    id: 4,
    groupName: '测试小组',
    leader: 'admin',
    memberCount: 10,
    fileCount: 20,
    linkCount:3,
    createTime: '2023-05-01',
    updateTime: '2023-05-01'
  }
])
const selectUserData = ref([
  {
    id: 1,
    username: 'admin',
    account: 'admin'
  },
  {
    id: 2,
    username: 'admin',
    account: 'admin'
  },
  {
    id: 3,
    username: 'admin',
    account: 'admin'
  },
  {
    id: 4,
    username: 'admin',
    account: 'admin'
  },
  {
    id: 5,
    username: 'admin',
    account: 'admin'
  },
  {
    id: 6,
    username: 'admin',
    account: 'admin'
  }
])
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
const userData = ref([
  {
    id: 1,
    username: '李文博',
    account: 'ops_liwenbo'
  },
  {
    id: 2,
    username: '曹磊',
    account: 'ops_caolei'
  },
])
const linkData = ref([
  {
    id: 1,
    linkName: 'vue',
  },
  {
    id: 2,
    linkName: 'java',
  },
])
const onSearch =  (s:string) => {
  console.log(s)
}

const reset = () => {
}

const handleAddGroup = () => {
  console.log('handleAddGroup')
  addGroupVisible.value = true
}

const submit = () => {
  console.log('confirmClick')
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

const handleAddGroupUser = () => {
  console.log('handleAddGroupUser')
  userVisible.value = true
}

const handleAddGroupLink = () => {
  console.log('handleAddGroupLink')
  linkVisible.value = true
}

const handleCommitUser = () => {
  console.log('handleCommitUser')
  userVisible.value = false
}

const handleCommitLink = () => {
  console.log('handleCommitLink')
  linkVisible.value = false
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
