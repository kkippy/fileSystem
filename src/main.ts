import './assets/main.css'
import './style.css'

import { createApp } from 'vue'
import  pinia  from '@/stores'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import '@/styles/index.scss';
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import App from './App.vue'
import router from './router'
import 'virtual:svg-icons-register'
import SvgIcon from "@/components/SvgIcon/index.vue";
import '@imengyu/vue3-context-menu/lib/vue3-context-menu.css'
import ContextMenu from '@imengyu/vue3-context-menu'
import './assets/iconfont/iconfont.css'

// 引入鉴权文件
// import './permission'

// 自定义指令
import {hasPermission} from '@/directive/hasPermission'
const app = createApp(App)
hasPermission(app)

app.use(router)
app.use(pinia)
app.component('SvgIcon', SvgIcon)
//国际化
app.use(ElementPlus, {
  locale: zhCn,
})
app.use(ContextMenu)


app.mount('#app')
