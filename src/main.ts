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

// 引入鉴权文件
import './permission'

const app = createApp(App)

app.use(router)
app.use(pinia)

//国际化
app.use(ElementPlus, {
  locale: zhCn,
})

app.mount('#app')
