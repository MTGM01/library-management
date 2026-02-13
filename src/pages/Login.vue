<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const username = ref("");
const password = ref("");

const handleLogin = () => {
  // ذخیره توکن یا وضعیت لاگین
  localStorage.setItem("isAuthenticated", "true");
  localStorage.setItem("user", JSON.stringify({ username: username.value }));

  const redirectPath =
    router.currentRoute.value.query.redirect?.toString() || "/";

  router.push(redirectPath);
};
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50">
    <div class="max-w-md w-full p-6 bg-white rounded-lg shadow-lg">
      <h2 class="text-2xl font-bold mb-6 text-center">ورود به سیستم</h2>
      <form @submit.prevent="handleLogin" class="flex flex-col">
        <div class="flex flex-col items-end mb-4 w-full">
          <label class="block text-gray-700 mb-2">نام کاربری</label>
          <input
            v-model="username"
            type="text"
            class="w-96% p-2 border border-solid rounded-lg"
            required
          />
        </div>
        <div class="flex flex-col items-end mb-6 w-full">
          <label class="block text-gray-700 mb-2">رمز عبور</label>
          <input
            v-model="password"
            type="password"
            class="w-96% p-2 border border-solid rounded-lg"
            required
          />
        </div>
        <button
          type="submit"
          class="w-full bg-blue-600 text-white py-2 rounded-lg cursor-pointer hover:bg-blue-700 border-none"
        >
          ورود
        </button>
      </form>
    </div>
  </div>
</template>
