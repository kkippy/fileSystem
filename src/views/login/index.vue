<template>
  <div class="loginMain">
    <div class="login-box">
      <div class="title">文件管理系统</div>
      <login-form />
    </div>
  </div>
</template>

<script setup lang="ts">
import  LoginForm  from "./components/loginForm.vue";

</script>



<style scoped lang="scss">

.loginMain {
  height: 100vh;
  margin: 0 auto;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #0093E9;
  background-image: linear-gradient(135deg, #0093E9 0%, #80D0C7 100%);

  .login-box {
    position: relative;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    flex-direction: column;
    margin: auto;

    justify-content: center;
    width: 96.5%;
    height: 94%;
    padding: 0 50px;
    background-size: cover;

    background-color: rgb(255 255 255 / 30%);
    border-radius: 10px;
    .title{
      font-size: 30px;
      font-weight: 550;
      letter-spacing: 5px;
      margin-bottom: 10px;
    }
  }
}

</style>