<template>
  <div class="loginForm">
    <div>
      <el-form ref="loginFormRef" :model="loginFormReactive" :rules="loginRules" label-width="80px">
        <el-form-item label="用户名" prop="username">
          <el-input placeholder="admin" v-model="loginFormReactive.username" :prefix-icon="User" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input placeholder="111111" v-model="loginFormReactive.password" type="password" :prefix-icon="Lock" />

        </el-form-item>
      </el-form>
    </div>

    <div class="login-btn">
      <el-button :icon="CircleClose" round size="large"  @click="resetForm(loginFormRef)"> 重置 </el-button>
      <el-button :icon="UserFilled" round size="large" type="primary"  @click="login">
        登录
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import {reactive, ref} from "vue"
import type { ElForm } from "element-plus";
import { CircleClose, UserFilled,User, Lock } from "@element-plus/icons-vue";
import { ElMessage } from 'element-plus'
import {useRouter,useRoute} from "vue-router";
// import {LoginForm} from "@/api/user/type.ts";
// import {useUserStore} from "@/store/modules/user.ts"
// import {getTime} from "@/utils/time.ts"

export interface LoginForm {
  username:string,
  password:string
}


type FormInstance = InstanceType<typeof ElForm>;
const loginFormRef = ref<FormInstance>();
const router = useRouter();
const route = useRoute();
const loginRules = reactive({
  username: [{ required: true, message: "请输入用户名", trigger: "blur" }],
  password: [{ required: true, message: "请输入密码", trigger: "blur" }]
});

// const userStore = useUserStore();

const loginFormReactive = reactive<LoginForm>({
  username:'admin',
  password:'111111'
})

const resetForm = (formEl: FormInstance | undefined)=> {
  if(!formEl) return
  formEl.resetFields();
}


const login = async ()=> {
  let redirect:any = route.query.redirect
  await router.push({path: redirect|| '/' })
  ElMessage({
    message: '登录成功',
    type: 'success'
  })
}
</script>


<style scoped lang="scss">
.loginForm {
  width: 420px;
  padding: 50px 40px 45px;
  background-color: var(--el-bg-color);
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