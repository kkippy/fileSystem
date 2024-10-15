import { createWebHashHistory, createRouter } from 'vue-router'
import {constantRoute} from "./routers";
const  router = createRouter({
  history: createWebHashHistory(),
  routes: constantRoute,
  // 滚动行为
  scrollBehavior: () => ({ left: 0, top: 0 }),
})

export default router