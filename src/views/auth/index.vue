<template>
  <div class="main-container">
    <el-card body-class="cardStyle" style="border-radius: 10px">
      <search-header-component
        class="myHeader"
        placeholderTitle="请输入姓名"
        @onSearch="onSearch"
        @reset="reset"
      >
        <template #searchBtn>
          <el-button type="primary" style="margin-right: 10px" :icon="Plus" @click="handleAddUser">
            <span style="margin-left: 5px;">添加用户</span>
          </el-button>

          <el-button type="danger" style="margin-left: 0" :icon="Delete" @click="handleDelete" :disabled="!removeUserIdList.length">
            <span style="margin-left: 5px;">批量删除</span>
          </el-button>

        </template>
      </search-header-component>

      <el-table
        v-loading="loading"
        @selection-change="selectChange"
        :data="userData"
        border
        height="65vh"
        style="width: 100%">
        <el-table-column align="center" type="selection" ></el-table-column>
        <el-table-column align="center" type="index" label="序号" width="80" />
        <el-table-column align="center" show-overflow-tooltip prop="account" label="账号" />
        <el-table-column align="center" show-overflow-tooltip prop="name" label="姓名" />
        <el-table-column align="center" show-overflow-tooltip prop="number" label="工号" />
        <el-table-column align="center" show-overflow-tooltip prop="roleName" label="用户角色" width="100" />
        <el-table-column align="center" show-overflow-tooltip prop="updateTime" label="更新时间" width="180" />
        <el-table-column align="center" show-overflow-tooltip prop="userStatus" label="用户状态" width="100" >
          <template #default={row}>
            <el-switch
              v-model="row.userStatus"
              :active-value="0"
              :inactive-value="1"
              @change="handleChangeUserStatus(row)"
              inline-prompt
              style="--el-switch-on-color: #13ce66;
              --el-switch-off-color: #ff4949"
              active-text="启用"
              inactive-text="禁用"
            />
          </template>

        </el-table-column>
        <el-table-column align="center" label="操作" width="250">
          <template #default="{row}">
            <el-button :disabled="(row.roleName === '管理员' && (currentUser !== row.account && row.roleName !== '普通用户')) ||
              (row.roleName === '超级管理员' && userStore.userRole !== 'super_admin')"
                       :icon="Edit"
                       type="primary"
                       @click="handleEditUser(row)"
            >
              编辑
            </el-button>
            <el-popconfirm
              :title="`确认删除${row.account}?`"
              width="200px"
              @confirm="handleDelUser(row.id)"
            >
              <template #reference>
                <el-button :disabled="row.roleName === '管理员' || userStore.userName === row.account  " type="danger" :icon="Delete">
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
      title="修改用户"
      size="500"
    >
      <template #default>
        <div>
          <el-form ref="userFromRef" :model="userFrom" >

            <el-form-item label="姓名" prop="name" label-width="90px">
              <el-input placeholder="请输入姓名" v-model="userFrom.name" />
            </el-form-item>

            <el-form-item label="账号" prop="account" label-width="90px">
              <el-input placeholder="请输入账号" v-model="userFrom.account" />
            </el-form-item>

            <el-form-item label="工号" prop="number" label-width="90px">
              <el-input placeholder="请输入工号" v-model="userFrom.number" />
            </el-form-item>

            <el-form-item  label="用户密码" prop="password" label-width="90px">
              <el-input placeholder="请输入用户密码" v-model="userFrom.password" />
            </el-form-item>

            <el-form-item v-if="canChangeRole"  label="用户角色" prop="roleName" label-width="90px">
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

    <el-dialog title="添加用户" v-model="addUserVisible" width="500px">
      <el-form ref="addUserFromRef" status-icon :model="userFrom" :rules="addRules">
        <el-form-item label="姓名"  prop="name" label-width="90px">
          <el-input placeholder="请输入姓名" v-model="userFrom.name" />
        </el-form-item>
        <el-form-item label="账号" prop="account" label-width="90px">
          <el-input placeholder="请输入账号"  v-model="userFrom.account" />
        </el-form-item>
        <el-form-item label="工号" prop="number" label-width="90px">
          <el-input placeholder="请输入工号"  v-model="userFrom.number" />
        </el-form-item>
        <el-form-item label="用户密码" prop="password" label-width="90px">
          <el-input type="password" placeholder="请输入用户密码" autocomplete="off" v-model="userFrom.password" />
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPassword" label-width="90px">
          <el-input type="password" placeholder="请再次输入密码" autocomplete="off" v-model="userFrom.confirmPassword" />
        </el-form-item>
        <el-form-item v-if="canChangeRole" prop="roleName" label="用户角色" label-width="90px">
            <el-select
              v-model="userFrom.roleName"
              placeholder="请选择用户角色"
            >
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
        </el-form-item>
        <el-form-item label="手机号" label-width="90px">
          <el-input placeholder="请输入手机号" v-model="userFrom.phone" />
        </el-form-item>
        <el-form-item label="邮箱" label-width="90px">
          <el-input placeholder="请输入邮箱" v-model="userFrom.mail" />
        </el-form-item>
      </el-form>


      <template #footer>
        <div style="flex: auto">
          <el-button @click="addUserVisible = false">取消</el-button>
          <el-button type="primary" @click="confirmAddClick">提交</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import {ref, onMounted, reactive,nextTick,computed} from "vue";
import { Delete, Edit, Plus} from '@element-plus/icons-vue'
import { ElMessage} from 'element-plus'
import type {ComponentSize,FormInstance} from "element-plus";
import {searchUser,addOrUpdateUser,deleteUser} from '@/api/user'
import {useUserStore} from "@/stores/user"
import SearchHeaderComponent from '@/components/SearchHeader/index.vue'

let size = ref<ComponentSize>('default')
let currentPage = ref<number>(1)
let pageSize = ref<number>(10)
let total = ref<number>(0)
let drawer = ref<boolean>(false)
let userFromRef = ref<FormInstance>()
let addUserFromRef = ref<FormInstance>()
let currentUserName = ref<string>('')
const removeUserIdList = ref([])
const userData = ref([])
const userStore = useUserStore()
const loading = ref<boolean>(true)
const currentPassword = ref('')
const addUserVisible = ref<boolean>(false)
export interface IUserForm {
  id?:number,
  account:string,
  name:string,
  password:string,
  number:number | string,
  phone:string,
  roleName:string,
  mail:string,
  userStatus?:number | boolean,
  confirmPassword:string
}

const currentUser = computed(()=>{
  return userStore.userName
})

const canChangeRole = computed(()=>{
  return userStore.userRole === 'super_admin';
})

const userFrom = reactive<IUserForm>({
  account:"",
  name:"",
  password:"",
  number:"",
  phone:"",
  roleName:"",
  mail:"",
  confirmPassword:""
})

const validatorUserName = (rule: any, value: any, callback: any) => {
  if(value.trim().length < 1){
    callback(new Error("账号不能小于1位"))
  }else{
    callback()
  }
}

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

const validatorConfirmPassword = (rule:any,value:any,callBack:any)=>{
  if(value !== userFrom.password){
    callBack(new Error('两次密码不一致'))
  }else{
    callBack()
  }
}

const addRules = reactive({
  account:[
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
  confirmPassword:[
    {required:true,trigger:"blur",validator:validatorConfirmPassword}
  ],
  roleName:[
    {
      required:true,
      message: '请选择用户角色',
      trigger: 'change',
    }
  ]
})

const options = [
  {
    value: '普通用户',
    label: '普通用户',
  },
  {
    value: '管理员',
    label: '管理员',
  },
  {
    value: '超级管理员',
    label: '超级管理员',
  },
]

onMounted(()=>{
  getUser()
})

const onSearch = async (searchValue:string) => {
  const result:any = await searchUser( currentPage.value,
    pageSize.value,{name:searchValue} )
    userData.value = result.items
    total.value = result.counts
}

const reset = () => {
  getUser()
}

const handleAddUser = () => {
  Object.assign(userFrom,JSON.parse(JSON.stringify(
    {
      account:"",
      name:"",
      password:"",
      number:"",
      roleCode:'user',
      confirmPassword:''
    }
  )))
  if(addUserFromRef.value) {
    addUserFromRef.value.clearValidate()
  }
  nextTick(() => {
    addUserFromRef.value?.clearValidate()
  })
  addUserVisible.value = true
}

const selectChange = (value:any) => {
  removeUserIdList.value = value
}

const handleDelete = async () => {
    ElMessage({
      message: '批量删除功能尚未实现',
      type: 'warning'
    })
}

const handleEditUser = (row:any) => {
  currentPassword.value = row.password
  row.password = ''
  Object.assign(userFrom,row)
  currentUserName.value = row.account
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

const getUser = async (pager = 1) => {
  currentPage.value = pager
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
  try{
    if(userFromRef.value?.fields[3].fieldValue === '') {
      userFrom.password = currentPassword.value
    }
    const result:any = await addOrUpdateUser(userFrom.id,userFrom)
    if(result.code === 200){
      ElMessage({
        message: '修改成功',
        type: "success"
      })
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
    }
  } catch (error) {
    console.log(error)
  } finally {
    drawer.value = false
  }
}

const confirmAddClick = async () => {
  try {
    await addUserFromRef.value?.validate()
    console.log(userFrom,'3')
    const result: any = await addOrUpdateUser(null,userFrom)
    console.log(result,'2')
    ElMessage({
      message: result.code === 200 ? '添加成功': result.msg,
      type: result.code === 200 ? 'success' : 'error'
    })
  } catch (error){
    console.log(error)
  } finally {
    addUserVisible.value = false
    await getUser()
  }
}

const handleChangeUserStatus = async (row:any) => {
  const result:any = await addOrUpdateUser(row.id,row)
  ElMessage({
    message: result.code === 200 ? '状态修改成功': result.msg,
    type: result.code === 200 ? 'success' : 'error'
  })
  await getUser()
}
</script>

<style scoped lang="scss">

.main-container{
  :global(.cardStyle){
    border-radius: 10px;
    padding-top: 0;
  }
  .myHeader {
    box-shadow: none;
  }
}

</style>

