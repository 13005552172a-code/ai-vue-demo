import { createWebHistory, createRouter } from 'vue-router'

const backendRoutes=[
  {
    path:'/',
    redirect: '/back/dashboards'
  },
  {
    path:'/back',
    component:()=>import('../components/BackendLayout.vue'),
    children:[
      {//1
        path:'dashboards',
        component:()=>import('../views/back/dashboards.vue'),
        meta:{
          title:'数据分析',
          icon:'PieChart'
        }
      },
      {//2
        path:'knowledge',
        component:()=>import('../views/back/knowledge.vue'),
        meta:{
          title:'知识文章',
          icon:'Reading'
        }
      },
      {//3
        path:'consultations',
        component:()=>import('../views/back/consultations.vue'),
        meta:{
          title:'咨询记录',
          icon:'Collection'
        }
      },
      {//4
        path:'emotional',
        component:()=>import('../views/back/emotional.vue'),
        meta:{
          title:'情绪日志',
          icon:'UserFilled'
        }
      }
    ]
  },
  // login
  {
    path:'/auth',
    component:()=>import('../components/AuthLayout.vue'),
    children:[
      {
        path:'login',
        component:()=>import('../views/auth/login.vue'),
        meta:{title:'登录'}
      },
      {
        path:'register',
        component:()=>import('../views/auth/register.vue'),
        meta:{title:'注册'}
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes: backendRoutes
})

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  if(token){
    const userInfo=JSON.parse(localStorage.getItem('userInfo'))
    if(userInfo.userType===2){
      if(to.path.startsWith('/back')){
        next()
      }else{
        next('/back/dashboards')
      }
    }
    else if(userInfo.userType===1){
      
    }
  }else{
    if(to.path.startsWith('/back')){
      // 如果是返回后台页面，那么退出到登录页面
      next('/auth/login')
    }else{
      next()
    }
  }
})
export default router