// 路由鉴权文件
import router from '@/router'

import NProgress from 'nprogress'
import pinia from "./stores";
import  {useUserStore} from "./stores/user.ts";
import { getUserInfo} from '@/api/user'
// 引入对应css样式
import 'nprogress/nprogress.css'
import { ElMessage } from 'element-plus'

// 修改进度条插件的配置
NProgress.configure({
  showSpinner: false,
  easing: 'ease',
  speed: 700
})

router.beforeEach(async (to:any, from:any, next:any) => {
  NProgress.start()
  const userStore = useUserStore(pinia)
  const token = userStore.token
  const username = userStore.userName
  const sessionTime = userStore.sessionTime
  const userId = userStore.userId
  console.log(sessionTime,'sessionTime')

  // if (token && to.path === '/login') {
  //   // 如果已经有 token 并且试图访问登录页，则重定向到主页或其他页面
  //   next('/');
  // } else if (!token && to.path !== '/login') {
  //   // 如果没有 token 并且试图访问非登录页，则重定向到登录页
  //   next('/login');
  // } else {
  //   // 其他情况直接放行
  //   next();
  // }


  if(token){
    if (to.path == '/login' ){
      next({path:'/'})
    } else {
      if(username){
        next()
      } else {
        //如果没有用户信息则在此发请求获取到用户信息,以实现用户信息的变相持久化
        try {
          await userStore.getInfo()
          next({...to,replace:true})
        } catch (e){
          //token过期
          ElMessage.error('登录过期，请重新登录')
          await userStore.userLogout()
          next({
            path:'/login',
            query:{
              redirect:to.path
            }
          })
        }
      }
    }

  } else { //用户未登录
    if(to.path == '/login'){ //如果要去登录页面，放行
      next()
    } else { //想去其余的页面，拒绝
      next({
        path:'/login',
        query:{
          redirect:to.path
        }
      })
    }
  }

})


router.afterEach(() =>{
  NProgress.done()
})