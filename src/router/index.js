import { createWebHistory, createRouter } from 'vue-router'

const backendRoutes=[
  {
    path:'/',
    redirect: '/back'
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
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes: backendRoutes
})

// router.beforeEach((to, from, next) => {
  
// })
export default router