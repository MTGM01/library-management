import { createRouter, createWebHistory } from "vue-router";
import Home from "../pages/Home.vue";
import Login from "../pages/Login.vue";
import Users from "../pages/Users.vue";
import MyReservations from "../pages/MyReservations.vue";
import { pinia } from "../repository/pinia";
import { useAuthStore } from "../repository/authStore";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "home",
      component: Home,
      meta: { requiresAuth: true }, // این صفحه نیاز به احراز هویت دارد
    },
    {
      path: "/login",
      name: "login",
      component: Login,
      meta: { requiresAuth: false }, // صفحه لاگین نیاز به احراز هویت ندارد
    },
    {
      path: "/users",
      name: "users",
      component: Users,
      meta: { requiresAuth: true },
    },
    {
      path: "/my-reservations",
      name: "my-reservations",
      component: MyReservations,
      meta: { requiresAuth: true },
    },
  ],
});

router.beforeEach(async (to, _from, next) => {
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);
  const authStore = useAuthStore(pinia);

  if (to.name === "login") {
    // Authentication middleware: without BOTH the isAuthenticated flag and
    // a stored user-profile there is no session — clear leftovers, stay here.
    if (!authStore.hasValidSession) {
      authStore.logout();
      return next();
    }
    if (authStore.isBlocked) {
      await authStore.forceLogoutBlocked();
      return next();
    }
    try {
      await authStore.refreshSessionStatus();
    } catch {
      return next();
    }
    if (authStore.hasValidSession) return next({ name: "home" });
    return next();
  }

  // Authentication middleware: a protected route needs BOTH the
  // isAuthenticated flag AND a stored user-profile. Either one missing
  // (e.g. cleared storage, half-written session, reload) → login page.
  if (requiresAuth && !authStore.hasValidSession) {
    authStore.logout();
    return next({
      name: "login",
      query: { redirect: to.fullPath },
    });
  }

  if (requiresAuth && authStore.hasValidSession) {
    if (authStore.isBlocked) {
      await authStore.forceLogoutBlocked();
      return next(false);
    }
    try {
      const stillValid = await authStore.refreshSessionStatus();
      if (!stillValid) {
        return next({
          name: "login",
          query: { redirect: to.fullPath },
        });
      }
    } catch {
      if (!useAuthStore(pinia).isAuthenticated) return next(false);
      return next();
    }
  }

  return next();
});

export default router;
