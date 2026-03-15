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