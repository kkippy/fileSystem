<template>
  <div>
    <div class="header" >
      <el-form>
        <el-form-item label="用户名" style="margin-top: 18px;margin-left: 20px">
          <el-input v-model="searchUserName" placeholder="请输入用户名" />
        </el-form-item>
      </el-form>

      <div style="margin-right: 40px">
        <el-button type="primary" :icon="Search" @click="onSearch" :disabled="!searchUserName">搜索</el-button>
        <el-button @click="reset">重置</el-button>
      </div>
    </div>

    <el-card style="margin-top: 20px;border-radius: 10px">
<!--    <el-card style="border-radius: 10px">-->
      <el-button type="primary" style="margin-right: 10px" :icon="Plus" @click="handleAddUser">
        <span style="margin-left: 5px;">添加用户</span>
      </el-button>

      <el-button type="danger" :icon="Delete" @click="handleDelete" :disabled="!removeUserIdList.length">
        <span style="margin-left: 5px;">批量删除</span>
      </el-button>

      <el-table @selection-change="selectChange" :data="userData" border height="67vh" style="width: 100%;margin-top: 20px">
        <el-table-column align="center" type="selection" ></el-table-column>
        <el-table-column align="center" type="index" label="序号" width="80" />
        <el-table-column align="center" prop="id" label="id" width="80" />
        <el-table-column align="center" show-overflow-tooltip prop="username" label="登录名" />
        <el-table-column align="center" show-overflow-tooltip prop="name" label="用户昵称" />
        <el-table-column align="center" show-overflow-tooltip prop="roleName" label="用户角色" width="120" />
        <el-table-column align="center" show-overflow-tooltip prop="createTime" label="创建时间" width="180" />
        <el-table-column align="center" show-overflow-tooltip prop="updateTime" label="更新时间" width="180" />
        <el-table-column align="center" label="操作" width="350">
          <template #default="{row}">
            <el-button :icon="Edit" type="primary" @click="handleEditUser(row)">
              编辑
            </el-button>
            <el-popconfirm
              :title="`确认删除${row.username}?`"
              width="200px"
              @confirm="handleDelUser(row.id)"
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
        :size="size"
        :page-sizes="[20,50,100]"
        :background="true"
        layout="prev,pager,next,jumper,->,sizes,total"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="getUser"
      />

    </el-card>
    <el-drawer
      v-model="drawer"
      :title="userFrom.id ? '修改用户' : '添加用户'"
      size="500"
    >
      <template #default>
        <div>
          <el-form ref="userFromRef" :model="userFrom" :rules="rules">
            <el-form-item label="登录名" prop="username" label-width="90px">
              <el-input placeholder="请输入登录名" v-model="userFrom.username" />
            </el-form-item>

            <el-form-item label="用户昵称" prop="name" label-width="90px">
              <el-input placeholder="请输入用户昵称" v-model="userFrom.name" />
            </el-form-item>

            <el-form-item v-if="!userFrom.id" label="用户密码" prop="password" label-width="90px">
              <el-input placeholder="请输入用户密码" v-model="userFrom.password" />
            </el-form-item>
          </el-form>
        </div>

      </template>
      <template #footer>
        <div style="flex: auto">
          <el-button @click="cancelClick">取消</el-button>
          <el-button type="primary" @click="confirmClick">提交</el-button>
        </div>
      </template>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import {ref, onMounted, reactive,nextTick} from "vue";
import {Delete, Edit, Plus, Search} from "@element-plus/icons-vue";
import {ElMessage} from "element-plus";
import type {ComponentSize} from "element-plus";



let size = ref<ComponentSize>('default')
let currentPage = ref<number>(1)
let pageSize = ref<number>(10)
let total = ref<number>(0)
let drawer = ref<boolean>(false)
let userFromRef = ref()
let currentUserName = ref<string>('')
let searchUserName = ref<string>('')
const removeUserIdList = ref([])
const userData = [
  {
    id:1,
    username:"admin",
    name:"管理员",
    roleName:"管理员",
    createTime:"2022-01-01",
    updateTime:"2022-01-01"
  },
  {
    id:2,
    username:"user",
    name:"普通用户",
    roleName:"普通用户",
    createTime:"2022-01-01",
    updateTime:"2022-01-01"
  }
]

const validatorUserName = (rule: any, value: any, callback: any) => {
  if(value.trim().length < 5){
    callback(new Error("字符长度不能小于5位"))
  }else{
    callback()
  }
}

const validatorPassword = (rule:any,value:any,callBack:any)=>{
  if(value.trim().length < 6){
    callBack(new Error('密码长度不能少于6位'))
  }else{
    callBack()
  }
}

const rules = reactive({
  username:[
    {required:true,trigger:"blur",validator:validatorUserName}
  ],
  name:[
    {required:true,trigger:"blur",validator:validatorUserName}
  ],
  password:[
    {required:true,trigger:"blur",validator:validatorPassword}
  ]
})

//存储新增或修改用户的表单
const userFrom = reactive({
  id:0,
  username:"",
  name:"",
  password:""
})

onMounted(()=>{
  getUser()
})

const onSearch = () => {
  getUser()
  searchUserName.value = ''
}

const reset = () => {
  getUser()
}

const handleAddUser = () => {
  Object.assign(userFrom,{
    id:0,
    username:"",
    name:"",
    password:""
  }) //清空userFrom的数据

  // nextTick(() => {
  //   console.log(userFromRef.value,'userFromRef.value')
  //
  //   userFromRef.value.resetFields()
  // })
  drawer.value = true
}

const selectChange = (value:any) => {
  removeUserIdList.value = value
}

const handleDelete = async () => {
    ElMessage({
      message: '批量删除成功',
      type: 'success'
    })

}

const handleEditUser = (row:any) => {
  currentUserName.value = row.username
  // nextTick(() => {
  //   userFromRef.value.resetFields()
  // })
  Object.assign(userFrom,row)
  drawer.value = true
}

const handleDelUser = async (id:number) => {
    ElMessage({
      message: '删除成功',
      type: 'success'
    })
}

const handleSizeChange = () => {
  currentPage.value = 1
  getUser()
}

const getUser = async (pager = 1) => {

}

const cancelClick = () => {
  drawer.value = false
}

const confirmClick = async () => {
  await userFromRef.value.validate()
  ElMessage({
    message: '添加成功',
    type: 'success'
  })
  drawer.value = false


  // if(result.code === 200){
  //   ElMessage({
  //     message: !userFrom.id ? '添加成功' : '修改成功',
  //     type: "success"
  //   })
  //   drawer.value = false
  //   await getUser(userFrom.id ? currentPage.value : 1)
  //   if(userStore.userName === currentUserName.value) {
  //     //若修改的是当前登录的用户，则浏览器自动更新，引发重新登录
  //     window.location.reload()
  //   }
  // } else {
  //   ElMessage({
  //     message: !userFrom.id ? '添加失败' : '修改失败',
  //     type: "error"
  //   })
  //   drawer.value = false
  // }
}

</script>



<style scoped lang="scss">
.header {
  border-radius: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: row;
  box-shadow: 0 0 12px rgba(0,0,0,0.12);

  .el-card__body {
    padding: 0;

  }
}
</style>

<style scoped>

</style>