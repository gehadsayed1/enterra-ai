import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "../stores/authStore";

import Login from "../pages/Login.vue";
import Chat from "../pages/Chat.vue";

// Admin Pages

import FilesPage from "@/pages/admin/FilesPage.vue";
import UsersPage from "@/pages/admin/UsersPage.vue";
import AdminLayout from "@/layouts/AdminLayout.vue";
import DashboardPage from "@/pages/admin/DashboardPage.vue";
import NotFound from "@/pages/NotFound.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/login", component: Login },
    {
      path: "/:pathMatch(.*)*",
      name: "NotFound",
      component: NotFound,
    },
    { path: "/chat", component: Chat, meta: { auth: true } },

    {
      path: "/admin",
      component: AdminLayout,
      meta: { auth: true, admin: true },
      children: [
        { path: "dashboard", component: DashboardPage },
        { path: "files", component: FilesPage },
        { path: "users", component: UsersPage },
      ],
    },

    { path: "/", redirect: "/chat" },
  ],
});

router.beforeEach((to) => {
  const auth = useAuthStore();

  if (to.meta.auth && !auth.isAuthenticated) {
    return "/login";
  }

  if (to.meta.admin && auth.role !== "admin") {
    return "/chat";
  }
});

export default router;
