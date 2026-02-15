<script setup lang="ts">
import { computed, ref } from "vue";
import { useRouter } from "vue-router";
import { User } from "../repository/user";
import CircleLoading from "../components/CircleLoading.vue";
import EyeOff from "../components/icons/EyeOff.vue";
import Eye from "../components/icons/Eye.vue";
import BookOpen from "../components/icons/BookOpen.vue";

const router = useRouter();
const userName = ref("");
const password = ref("");
const isLoading = ref(false);
const showPassword = ref(false);

const passwordInputType = computed(() =>
  showPassword.value ? "text" : "password",
);

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
  <div
    class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50"
    dir="rtl"
  >
    <div class="w-full max-w-md">
      <div class="text-center mb-8">
        <div
          class="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-4 shadow-lg"
        >
          <BookOpen class="w-9 h-9 text-white" />
        </div>
        <h1 class="text-3xl font-bold text-gray-900 mb-2">
          سیستم مدیریت کتابخانه
        </h1>
        <p class="text-gray-600">برای ادامه، لطفاً وارد حساب کاربری خود شوید</p>
      </div>

      <div
        class="bg-white rounded-2xl shadow-xl border border-solid border-gray-100 p-8"
      >
        <form @submit.prevent="handleLogin" class="space-y-5">
          <div class="flex flex-col w-full">
            <label htmlFor="username" class="text-sm text-gray-700 mb-2">
              نام کاربری
            </label>
            <input
              id="username"
              type="text"
              v-model="userName"
              class="px-4 py-3 rounded-lg border border-solid border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              required
            />
          </div>

          <div class="flex flex-col w-full">
            <label htmlFor="password" class="text-sm text-gray-700 mb-2">
              رمز عبور
            </label>
            <div class="relative w-full">
              <input
                id="password"
                :type="passwordInputType"
                v-model="password"
                class="w-91% px-4 py-3 rounded-lg border border-solid border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                required
              />
              <button
                type="button"
                class="absolute left-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-400 hover:text-gray-600 bg-transparent border-none transition-colors"
                @click="showPassword = !showPassword"
              >
                <EyeOff v-if="showPassword" class="w-5 h-5" />
                <Eye v-else class="w-5 h-5" />
              </button>
            </div>
          </div>

          <label class="flex items-center gap-2 text-gray-600 cursor-pointer">
            <input
              type="checkbox"
              class="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span>مرا به خاطر بسپار</span>
          </label>

          <button
            type="submit"
            class="w-full relative bg-blue-600 cursor-pointer border-none text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl"
            :class="{ 'opacity-70 cursor-not-allowed': isLoading }"
            :disabled="isLoading"
          >
            <span>ورود به سیستم</span>
            <CircleLoading
              v-if="isLoading"
              class="absolute inset-0 mx-auto right-26 top-2 w-6 h-6"
            />
          </button>
        </form>
      </div>
    </div>
  </div>
</template>
