import { createApp } from "vue";
import "./public/styles/global.css";
import "uno.css";
import App from "./App.vue";
import router from "./router";
import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";

const app = createApp(App);

app.use(router);

app.use(Toast, {
  position: "top-right", // موقعیت: top-right, top-center, bottom-left و ...
  timeout: 2000, // مدت زمان نمایش (میلی‌ثانیه)
});

app.mount("#app");
