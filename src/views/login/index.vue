<template>
  <div class="loginMain">
    <div class="login-box">
      <h1>登录页面</h1>
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
  background-color: #6b57fe;
  background-image: linear-gradient(61deg, #6b57fe 30%, #ffba00 100%);



  .login-box {
    position: relative;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: space-around;
    width: 96.5%;
    height: 94%;
    padding: 0 50px;
    //margin: 0 auto;
    //background: url(@/assets/images/login.jpg) ;
    background-size: cover;

    background-color: rgb(255 255 255 / 30%);
    border-radius: 10px;
    //filter: alpha(opacity=80);
  }
}

</style>