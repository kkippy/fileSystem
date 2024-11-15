<template>
  <div class="loginForm">
    <div>
      <el-form ref="loginFormRef" :model="loginFormReactive" :rules="loginRules" label-width="80px" @keyup.enter="login">
        <el-form-item label="工号" prop="number">
          <el-input v-model="loginFormReactive.number" :prefix-icon="User" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input show-password type="password" v-model="loginFormReactive.password" :prefix-icon="Lock" />
        </el-form-item>
      </el-form>
    </div>

    <div class="login-btn">
      <el-button :icon="CircleClose" round size="large"  @click="resetForm(loginFormRef)"> 重置 </el-button>
      <el-button id="loginButton" :icon="UserFilled" round size="large" type="primary" @click="login">
        登录
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import type { ElForm } from "element-plus";
import { CircleClose, UserFilled,User, Lock } from "@element-plus/icons-vue";
import { ElMessage } from 'element-plus'
import {useRouter} from "vue-router";
import {useUserStore} from "@/stores/user"

export interface LoginForm {
  number:string,
  password:string
}

const userStore = useUserStore()
type FormInstance = InstanceType<typeof ElForm>;
const loginFormRef = ref<FormInstance>();
const router = useRouter();
const loginRules = reactive({
  number: [{ required: true, message: "请输入用户名", trigger: "blur" }],
  password: [{ required: true, message: "请输入密码", trigger: "blur" }]
});


const loginFormReactive = reactive<LoginForm>({
  number:'',
  password:''
})

const resetForm = (formEl: FormInstance | undefined)=> {
  if(!formEl) return
  formEl.resetFields();
}

const login = async ()=> {
  try{
    await userStore.userLogin(loginFormReactive)
    await router.push({path: '/'})
    ElMessage({
      message: '登录成功',
      type: 'success'
    })
  } catch (e ){
    ElMessage.error((e as  Error).message )
  }
}

</script>


<style scoped lang="scss">
.loginForm {
  width: 420px;
  padding: 50px 40px 45px;
  background-color:rgb(255, 255, 255,.4);
  border-radius: 10px;
  box-shadow: rgb(0 0 0 / 10%) 0 2px 10px 2px;
  .login-logo {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 45px;
    .login-icon {
      width: 60px;
      height: 52px;
    }
    .logo-text {
      padding: 0 0 0 25px;
      margin: 0;
      font-size: 42px;
      font-weight: bold;
      color: #34495e;
      white-space: nowrap;
    }
  }
  .el-form-item {
    margin-bottom: 40px;
  }
  .login-btn {
    display: flex;
    justify-content: space-between;
    width: 100%;
    margin-top: 40px;
    white-space: nowrap;
    .el-button {
      width: 185px;
    }
  }
}
</style>
