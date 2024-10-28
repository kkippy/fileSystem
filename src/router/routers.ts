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
        name: 'GridComponent',
        component: ()=>import('@/views/file/fileBoard.vue'),
        meta: {
          title: '信息化一室',
          bucket: 'section1',
          hidden: false,
        },
      },
      {
        path: '/section1', // 动态路由
        name: 'ListComponent',
        component: () => import('@/views/section/fileList.vue'),
        meta: {
          bucket: 'section1',
          hidden: true, // 在菜单中隐藏
        },
      },
      {
        path: '/section2',
        name: 'section2',
        component: ()=>import('@/views/file/fileBoard.vue'),
        meta: {
          title: '信息化二室',
          bucket: 'section2',
          hidden: false,
        },
      },
      {
        path: '/section2/:folderName', // 动态路由
        name: 'section2-folder',
        component: () => import('@/views/section/fileList.vue'),
        meta: {
          bucket: 'section2',
          hidden: true,
        },
      },
      {
        path: '/basic',
        name: 'basic',
        component: ()=>import('@/views/file/fileBoard.vue'),
        meta: {
          title: '基础架构室',
          bucket: 'basic',
          hidden: false,
        },
      },
      {
        path: '/basic/:folderName', // 动态路由
        name: 'basic-folder',
        component: () => import('@/views/section/fileList.vue'),
        meta: {
          bucket: 'section2',
          hidden: true,
        },
      },
      {
        path: '/support',
        name: 'support',
        component: ()=>import('@/views/file/fileBoard.vue'),
        meta: {
          title: '开发支持室',
          bucket: 'support',
          hidden: false,
        },
      },
      {
        path: '/support/:folderName', // 动态路由
        name: 'support-folder',
        component: () => import('@/views/section/fileList.vue'),
        meta: {
          bucket: 'section2',
          hidden: true,
        },
      },
      {
        path: '/manage',
        name: 'manage',
        component: ()=>import('@/views/file/fileBoard.vue'),
        meta: {
          title: '综合管理室',
          bucket: 'manage',
          hidden: false,
        },
      },
      {
        path: '/manage/:folderName', // 动态路由
        name: 'manage-folder',
        component: () => import('@/views/section/fileList.vue'),
        meta: {
          bucket: 'section2',
          hidden: true,
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
        component: ()=>import('@/views/auth/role.vue'),
        meta: {
          title: '小组管理',
          hidden: false,
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