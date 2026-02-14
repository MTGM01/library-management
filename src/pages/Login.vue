<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { User } from "../repository/user";
import CircleLoading from "../components/CircleLoading.vue";

const router = useRouter();
const userName = ref("");
const password = ref("");
const isLoading = ref(false);

async function handleLogin() {
  try {
    isLoading.value = true;
    await User.login({
      userName: userName.value,
      password: password.value,
    });
    const redirectPath =
      router.currentRoute.value.query.redirect?.toString() || "/";
    router.push(redirectPath);
  } catch (error) {
    console.error(error);
  } finally {
    isLoading.value = false;
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50">
    <div class="max-w-md w-full p-6 bg-white rounded-lg shadow-lg">
      <h2 class="text-2xl font-bold mb-6 text-center">ورود به سیستم</h2>
      <form @submit.prevent="handleLogin" class="flex flex-col">
        <div class="flex flex-col items-end mb-4 w-full">
          <label class="block text-gray-700 mb-2">نام کاربری</label>
          <input
            v-model="userName"
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
          :disabled="isLoading"
          class="w-full bg-blue-600 text-white h-9 text-15px relative rounded-lg cursor-pointer hover:bg-blue-700 border-none"
          :class="{ 'opacity-70 cursor-not-allowed': isLoading }"
        >
          <span v-if="!isLoading">ورود</span>
          <CircleLoading v-else class="absolute inset-0 m-auto w-6 h-6" />
        </button>
      </form>
    </div>
  </div>
</template>
