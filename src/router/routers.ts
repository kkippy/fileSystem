export const constantRoute = [
  {
    path: '/login',
    name: 'login',
    component:  ()=> import('@/views/login/index.vue'),
    meta: {
      title: '登录',
      hidden: true,//路由的标题在菜单中隐藏
    }
  },
  {
    path: '/',
    name: 'Department',
    redirect: '/section1',
    component:  ()=> import('@/layout/index.vue'),
    meta: {
      title: '信息化部',
      hidden: false,
      icon:''
    },
    children: [
      {
        path: '/section1',
        name: 'section1',
        component: ()=>import('@/views/section/section1.vue'),
        meta: {
          title: '信息化一室',
          hidden: false,
          icon:'home'
        },
      },
      {
        path: '/section2',
        name: 'section2',
        component: ()=>import('@/views/section/section2.vue'),
        meta: {
          title: '信息化二室',
          hidden: false,
          icon:'home'
        },
      },
      {
        path: '/support',
        name: 'support',
        component: ()=>import('@/views/section/support.vue'),
        meta: {
          title: '开发支持室',
          hidden: false,
          icon:'home'
        },
      },
      {
        path: '/basic',
        name: 'basic',
        component: ()=>import('@/views/section/basic.vue'),
        meta: {
          title: '基础架构室',
          hidden: false,
          icon:'home'
        },
      },
      {
        path: '/manage',
        name: 'manage',
        component: ()=>import('@/views/section/manage.vue'),
        meta: {
          title: '综合管理室',
          hidden: false,
          icon:'home'
        },
      },
    ]
  },

  {
    path:'/auth',
    name: 'auth',
    component:  ()=> import('@/layout/index.vue'),
    meta: {
      title: '权限管理',
      hidden: false,//路由的标题在菜单中隐藏
      icon:'auth'
    },
    redirect: '/auth/user',
    children: [
      {
        path: '/auth/user',
        name: 'User',
        component: ()=>import('@/views/auth/index.vue'),
        meta: {
          title: '用户管理',
          hidden: false,
          icon:'user'
        },
      },
      {
        path: '/auth/role',
        name: 'Role',
        component: ()=>import('@/views/auth/index.vue'),
        meta: {
          title: '角色管理',
          hidden: true,
          icon:'role'
        },
      },
    ]
  },
  {
    path:'/404',
    name: '404',
    component:  ()=> import('@/views/404/index.vue'),
    meta: {
      title: '404',
      hidden: true,//路由的标题在菜单中隐藏
    }
  }
]


export const anyRoute = {
  path: '/:pathMatch(.*)*',
  redirect: '/404',
  meta: {
    title: '任意路由',
    hidden: true,
  },
}