<template>
  <div>
    <div class="header" >
      <el-form>
        <el-form-item label="姓名" style="margin-top: 18px;margin-left: 20px">
          <el-input id="inputField" v-model="searchUserName" @keyup.enter="onSearch" placeholder="请输入姓名" />
        </el-form-item>
      </el-form>

      <div style="margin-right: 40px">
        <el-button type="primary" :icon="Search" @click="onSearch" :disabled="!searchUserName">搜索</el-button>
        <el-button @click="reset">重置</el-button>
      </div>
    </div>

    <el-card style="margin-top: 20px;border-radius: 10px">
      <el-button type="primary" style="margin-right: 10px" :icon="Plus" @click="handleAddUser">
        <span style="margin-left: 5px;">添加用户</span>
      </el-button>

      <el-button type="danger" :icon="Delete" @click="handleDelete" :disabled="!removeUserIdList.length">
        <span style="margin-left: 5px;">批量删除</span>
      </el-button>

      <el-table
        v-loading="loading"
        @selection-change="selectChange"
        :data="userData"
        border
        height="67vh"
        style="width: 100%;margin-top: 20px">
        <el-table-column align="center" type="selection" ></el-table-column>
        <el-table-column align="center" type="index" label="序号" width="80" />
        <el-table-column align="center" show-overflow-tooltip prop="username" label="登录名" />
        <el-table-column align="center" show-overflow-tooltip prop="name" label="姓名" />
        <el-table-column align="center" show-overflow-tooltip prop="number" label="工号" />
        <el-table-column align="center" show-overflow-tooltip prop="roleName" label="用户角色" width="100" />
        <el-table-column align="center" show-overflow-tooltip prop="createTime" label="创建时间" width="180" />
        <el-table-column align="center" show-overflow-tooltip prop="updateTime" label="更新时间" width="180" />
        <el-table-column align="center" label="操作" width="250">
          <template #default="{row}">
            <el-button :disabled="currentUser !== 'admin' && row.roleName === '管理员'"
                       :icon="Edit"
                       type="primary"
                       @click="handleEditUser(row)"
            >
              编辑
            </el-button>
            <el-popconfirm
              :title="`确认删除${row.username}?`"
              width="200px"
              @confirm="handleDelUser(row.id)"
            >
              <template #reference>
                <el-button :disabled="userStore.userName === row.username" type="danger" :icon="Delete">
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
      :title="formShow? '修改用户' : '添加用户'"
      size="500"
      :before-close="handleClose"
    >
      <template #default>
        <div>
          <el-form ref="userFromRef" :model="userFrom" :rules="!userFrom.id ? addRules : updateRules">

            <el-form-item label="姓名" prop="name" label-width="90px">
              <el-input placeholder="请输入姓名" v-model="userFrom.name" />
            </el-form-item>

            <el-form-item label="账号" prop="username" label-width="90px">
              <el-input placeholder="请输入账号" v-model="userFrom.username" />
            </el-form-item>

            <el-form-item label="工号" prop="number" label-width="90px">
              <el-input placeholder="请输入工号" v-model="userFrom.number" />
            </el-form-item>

            <el-form-item  label="用户密码" prop="password" label-width="90px">
              <el-input placeholder="请输入用户密码" v-model="userFrom.password" />
            </el-form-item>

            <el-form-item v-if="canChangeRole && userFrom.id"  label="用户角色" prop="roleName" label-width="90px">
              <el-select
                v-model="userFrom.roleName"
                placeholder="Select"
              >
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>

            <el-form-item label="手机号" prop="phone" label-width="90px">
              <el-input placeholder="请输入手机号" v-model="userFrom.phone" />
            </el-form-item>

            <el-form-item  label="邮箱" prop="mail" label-width="90px">
              <el-input placeholder="请输入邮箱" v-model="userFrom.mail" />
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
import {ref, onMounted, reactive,nextTick,computed} from "vue";
import {Delete, Edit, Plus, Search} from "@element-plus/icons-vue";
import {ElMessage} from "element-plus";
import type {ComponentSize,FormInstance} from "element-plus";
import {searchUser,addOrUpdateUser,deleteUser} from '@/api/user'
import {useUserStore} from "@/stores/user"

let size = ref<ComponentSize>('default')
let currentPage = ref<number>(1)
let pageSize = ref<number>(10)
let total = ref<number>(0)
let drawer = ref<boolean>(false)
let userFromRef = ref<FormInstance>()
let currentUserName = ref<string>('')
let searchUserName = ref<string>('')
const removeUserIdList = ref([])
const userData = ref([])
const userStore = useUserStore()
const loading = ref<boolean>(true)
const formShow = ref(false)
const currentPassword = ref('')
export interface IUserForm {
  id?:number,
  username:string,
  name:string,
  password:string,
  number:number | string,
  phone:string,
  roleName:string,
  mail:string,
}

const currentUser = computed(()=>{
  return userStore.userRole
})

const validatorUserName = (rule: any, value: any, callback: any) => {
  if(value.trim().length < 1){
    callback(new Error("账号不能小于1位"))
  }else{
    callback()
  }
}

const canChangeRole = computed(()=>{
  return userStore.userRole === 'admin';
})

const validatorPassword = (rule:any,value:any,callBack:any)=>{
  if(value.trim().length < 6){
    callBack(new Error('密码不能少于6位'))
  }else{
    callBack()
  }
}

const validatorNumber = (rule:any,value:any,callBack:any)=>{
  if(value.trim().length < 6){
    callBack(new Error('工号不能少于6位'))
  }else{
    callBack()
  }
}

const addRules = reactive({
  username:[
    {required:true,trigger:"blur",validator:validatorUserName}
  ],
  name:[
    {required:true,trigger:"blur",validator:validatorUserName}
  ],
  number:[
    {required:true,trigger:"blur",validator:validatorNumber}
  ],
  password:[
    {required:true,trigger:"blur",validator:validatorPassword}
  ],
  roleName:[
    {
      required:true,
      message: '请选择用户角色',
      trigger: 'change',
    }
  ]
})

const updateRules = reactive({})

const userFrom = reactive<IUserForm>({
  username:"",
  name:"",
  password:"",
  number:"",
  phone:"",
  roleName:"",
  mail:""
})

const options = [
  {
    value: '普通用户',
    label: '普通用户',
  },
  {
    value: '管理',
    label: '管理',
  },
  {
    value: '管理员',
    label: '管理员',
  },
]

onMounted(()=>{
  getUser()
})

const inputField = document.getElementById('inputField');
inputField?.addEventListener('keyup', function(event) {
  if (event.key === 'Enter') {
    onSearch()
  }
});

const onSearch = async () => {
  const result:any = await searchUser( currentPage.value,
    pageSize.value,{name:searchUserName.value} )
    userData.value = result.items
    total.value = result.counts
    searchUserName.value = ''
}

const reset = () => {
  getUser()
}

const handleAddUser = () => {
  Object.assign(userFrom,JSON.parse(JSON.stringify(
    {
      username:"",
      name:"",
      password:"",
      number:"",
      roleCode:'user'
    }
  )))
  if(userFromRef.value) {
    userFromRef.value.clearValidate()
  }
  nextTick(() => {
    userFromRef.value.clearValidate()
  })
  drawer.value = true
}

const handleClose = (done: () => void) => {
  userFromRef.value.clearValidate()
  Object.assign(userFrom,
    {
      username:"",
      name:"",
      password:"",
      number:"",
      roleCode:'user',
      mail:'',
      phone:''
    }
  )
  done()
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
  currentPassword.value = row.password
  row.password = ''
  Object.assign(userFrom,row)
  currentUserName.value = row.username
  drawer.value = true
}

const handleDelUser = async (id:number) => {
    const result:any = await deleteUser(id)
    if(result.code === 200){
      ElMessage({
        message: '删除成功',
        type: 'success'
      })
    await getUser(currentPage.value)
  }
}

const handleSizeChange = () => {
  currentPage.value = 1
  getUser()
}

const getUser = async () => {
  loading.value = true
  const result:any = await searchUser(currentPage.value,pageSize.value)
  loading.value = false
  userData.value = result.items
  total.value = result.counts
}

const cancelClick = () => {
  drawer.value = false
}

const confirmClick = async () => {
  await userFromRef.value.validate()
  if(userFromRef.value.fields[3].fieldValue === '') {
    userFrom.password = currentPassword.value
  }
  const result:any = await addOrUpdateUser(userFrom)
  if(result.code === 200){
    ElMessage({
      message: !userFrom.id ? '添加成功' : '修改成功',
      type: "success"
    })
    drawer.value = false
    await getUser(userFrom.id ? currentPage.value : 1)
      if(userStore.userName === currentUserName.value) {
        //若修改的是当前登录的用户，则浏览器自动更新，引发重新登录
        window.location.reload()
      }
  } else {
    ElMessage({
      message: '填写的用户信息有误，请检查',
      type: "error"
    })
    drawer.value = true
  }
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