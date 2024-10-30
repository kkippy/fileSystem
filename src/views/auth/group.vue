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
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import HeaderComponent from '@/components/SearchHeader/index.vue'
import { Delete, Plus } from '@element-plus/icons-vue'
import SvgIcon from '@/components/SvgIcon/index.vue'

const loading = ref<boolean>(false)
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

const onSearch =  (s:string) => {
  console.log(s)
}

const reset = () => {
}

const handleAddGroup = () => {
  console.log('handleAddGroup')
}

const handleEditGroup = () => {
  console.log('handleEditGroup')
}

const handleDelGroup = (id:number) => {
  console.log(id)
}

const handleChangeLinkStatus = (row:any) => {
  console.log(row)
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
}
</style>
