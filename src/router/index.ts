import { createRouter, createWebHistory } from "vue-router";
import Home from "../pages/Home.vue";
import Login from "../pages/Login.vue"; // صفحه لاگین رو import کنید
import Users from "../pages/Users.vue";
import UserDetail from "../pages/UserDetail.vue";
import MyReservations from "../pages/MyReservations.vue";

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
      path: "/users/:userId",
      component: UserDetail,
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

// تعریف router guard
router.beforeEach((to, from, next) => {
  // بررسی آیا مسیر نیاز به احراز هویت دارد
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);

  // بررسی وضعیت لاگین
  const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";

  if (requiresAuth && !isAuthenticated) {
    // اگر نیاز به احراز هویت دارد و لاگین نیست، برو به صفحه لاگین
    next({
      name: "login",
      query: { redirect: to.fullPath }, // آدرس فعلی رو ذخیره کن تا بعد از لاگین برگرده
    });
  } else if (to.name === "login" && isAuthenticated) {
    // اگر کاربر لاگین است و می‌خواد بره به صفحه لاگین، بفرست به صفحه اصلی
    next({ name: "home" });
  } else {
    // در غیر اینصورت اجازه دسترسی بده
    next();
  }
});

export default router;
