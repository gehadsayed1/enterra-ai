import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/authStore'
import Login from '../pages/Login.vue'
import Chat from '../pages/Chat.vue'
// import AdminDashboard from '../pages/AdminDashboard.vue'




const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/login', component: Login },
    { path: '/chat', component: Chat, meta: { auth: true } },
    // { path: '/admin', component: AdminDashboard, meta: { auth: true, admin: true } },
    { path: '/', redirect: '/chat' }
  ]
})

router.beforeEach((to) => {
  const auth = useAuthStore()

  if (to.meta.auth && !auth.isAuthenticated) {
    return '/login'
  }

  if (to.meta.admin && auth.role !== 'admin') {
    return '/chat'
  }
})

export default router
