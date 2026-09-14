import { createApp } from "vue";
import "./public/styles/global.css";
import "uno.css";
import App from "./App.vue";
import router from "./router";
import { pinia } from "./repository/pinia";
import { useAuthStore } from "./repository/authStore";
import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";

const app = createApp(App);

app.use(pinia);
app.use(router);

app.use(Toast, {
  position: "top-right",
  timeout: 2000,
});

const authStore = useAuthStore(pinia);
authStore.initAuthMiddleware();

if (authStore.isBlocked) {
  void authStore.forceLogoutBlocked();
} else if (!authStore.hasValidSession) {
  authStore.logout();
}

app.mount("#app");
