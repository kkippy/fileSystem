// 路由鉴权文件
import router from '@/router'

import NProgress from 'nprogress'

// 引入对应css样式
import 'nprogress/nprogress.css'

// 修改进度条插件的配置
NProgress.configure({
  showSpinner: false,
  easing: 'ease',
  speed: 700
})

router.beforeEach((to:any, from:any, next:any) =>{
  NProgress.start()

  // 用户登录
  // if(token){
  //   if (to.path == '/login' ){
  //     next({path:'/'})
  //   } else {
  //     if(userName){
  //       next()
  //     } else {
  //       //如果没有用户信息则在此发请求获取到用户信息,以实现用户信息的变相持久化
  //       try {
  //         await userStore.getUserInfo()
  //         next({...to,replace:true})
  //       } catch (e){
  //         //token过期
  //         ElMessage.error('登录过期，请重新登录')
  //         await userStore.userLogout()
  //         next({
  //           path:'/login',
  //           query:{
  //             redirect:to.path
  //           }
  //         })
  //       }
  //     }
  //   }
  //
  // } else { //用户未登录
  // }
  if (to.path === '/') {
    next('/login'); // 重定向到登录页面
  } else {
    next();
  }
})

router.afterEach(() =>{
  NProgress.done()
})