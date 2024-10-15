// 路由鉴权文件
import router from '@/router'

import NProgress from 'nprogress'
import pinia from "./stores";
import  {useUserStore} from "./stores/user";
// 引入对应css样式
import 'nprogress/nprogress.css'
import { ElMessage } from 'element-plus'
import { REMOVE_TOKEN, REMOVE_USER, REMOVE_USER_NAME } from '@/utils/token'

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

// 登录后访问login的话直接跳到首页
  if(token){
    if (to.path == '/login' ){
      next({path:'/'})
    } else {
      if(username){ //有用户信息则放行
        next()
      } else {
        //如果没有用户信息则在此发请求获取到用户信息后再放行,以实现用户信息的变相持久化
        try {
          await userStore.getInfo()
          next({...to,replace:true})
        } catch (e){
          //token过期或手动修改token
          ElMessage.error('登录过期，请重新登录')
          await userStore.userLogouts()
          REMOVE_TOKEN()
          REMOVE_USER()
          REMOVE_USER_NAME()
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
        // query:{
        //   redirect:to.path
        // }
      })
    }
  }

})


router.afterEach(() =>{
  NProgress.done()
})