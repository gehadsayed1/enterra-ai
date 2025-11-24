import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "../stores/authStore";

// Lazy Loading
const Login = () => import("../pages/Login.vue");
const Chat = () => import("../pages/Chat.vue");
const FilesPage = () => import("@/pages/admin/FilesPage.vue");
const UsersPage = () => import("@/pages/admin/UsersPage.vue");
const AdminLayout = () => import("@/layouts/AdminLayout.vue");
const DashboardPage = () => import("@/pages/admin/DashboardPage.vue");
const DataSourcesPage = () => import("@/pages/admin/DataSourcesPage.vue");
const RolesPage = () => import("@/pages/admin/RolesPage.vue");
const NotFound = () => import("@/pages/NotFound.vue");

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
        { path: "data-sources", component: DataSourcesPage },
        { path: "users", component: UsersPage },
        { path: "roles", component: RolesPage },
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
