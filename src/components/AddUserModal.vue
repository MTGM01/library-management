<script setup lang="ts">
import { ref } from "vue";
import Close from "./icons/Close.vue";
import CircleLoading from "./CircleLoading.vue";
import { useUsersStore } from "../repository/usersStore";

const { isOpen } = defineProps<{
  isOpen: boolean;
}>();

const emit = defineEmits<{
  (event: "close"): void;
}>();

const usersStore = useUsersStore();
const isLoading = ref(false);
const firstName = ref("");
const lastName = ref("");
const userName = ref("");
const password = ref("");
const confirmPassword = ref("");
const mobile = ref("");

const errors = ref({
  firstName: "",
  lastName: "",
  userName: "",
  password: "",
  confirmPassword: "",
  mobile: "",
});

function validate(): boolean {
  let valid = true;
  errors.value = {
    firstName: "",
    lastName: "",
    userName: "",
    password: "",
    confirmPassword: "",
    mobile: "",
  };

  if (!firstName.value || firstName.value.length < 2) {
    errors.value.firstName = "نام باید حداقل ۲ حرف باشد";
    valid = false;
  }
  if (!lastName.value || lastName.value.length < 2) {
    errors.value.lastName = "نام خانوادگی باید حداقل ۲ حرف باشد";
    valid = false;
  }
  if (!userName.value || userName.value.length < 5) {
    errors.value.userName = "نام کاربری باید حداقل ۵ حرف باشد";
    valid = false;
  }
  if (!password.value || password.value.length < 8) {
    errors.value.password = "رمز عبور باید حداقل ۸ حرف باشد";
    valid = false;
  }
  if (password.value !== confirmPassword.value) {
    errors.value.confirmPassword = "رمز عبور مطابقت ندارد";
    valid = false;
  }
  if (!mobile.value || mobile.value.length < 9 || mobile.value.length > 13) {
    errors.value.mobile = "شماره تماس باید بین ۹ تا ۱۳ حرف باشد";
    valid = false;
  }

  return valid;
}

async function handleAddUser() {
  if (!validate()) return;

  try {
    isLoading.value = true;
    await usersStore.addUser({
      firstName: firstName.value,
      lastName: lastName.value,
      userName: userName.value,
      password: password.value,
      mobile: mobile.value,
    });
    emit("close");
    resetForm();
  } catch (error: any) {
    console.error(error);
    if (error instanceof TypeError && error.message.includes("fetch")) {
      // handled in store
    } else {
      // handled in store
    }
  } finally {
    isLoading.value = false;
  }
}

function resetForm() {
  firstName.value = "";
  lastName.value = "";
  userName.value = "";
  password.value = "";
  confirmPassword.value = "";
  mobile.value = "";
  errors.value = {
    firstName: "",
    lastName: "",
    userName: "",
    password: "",
    confirmPassword: "",
    mobile: "",
  };
}
</script>

<template>
  <div
    v-if="isOpen"
    @click.self="emit('close')"
    class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
  >
    <div
      class="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      dir="rtl"
    >
      <div
        class="sticky top-0 bg-white border-b border-b-solid border-gray-200 px-6 py-4 flex items-center justify-between"
      >
        <h2 class="text-xl my-0 font-bold text-gray-900">افزودن کاربر جدید</h2>
        <button
          @click="emit('close')"
          class="p-2 hover:bg-gray-100 rounded-lg transition-colors border-none bg-transparent cursor-pointer"
        >
          <Close class="w-5 h-5 text-gray-600" />
        </button>
      </div>

      <form @submit.prevent="handleAddUser" class="p-6 space-y-4">
        <div class="grid grid-cols-2 gap-4">
          <div class="flex flex-col w-full">
            <label class="text-sm font-medium text-gray-700 mb-2">
              نام *
            </label>
            <input
              type="text"
              v-model="firstName"
              required
              class="px-4 py-2 border border-solid border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="نام را وارد کنید"
            />
            <span v-if="errors.firstName" class="text-red-500 text-xs mt-1">{{ errors.firstName }}</span>
          </div>

          <div class="flex flex-col w-full">
            <label class="text-sm font-medium text-gray-700 mb-2">
              نام خانوادگی *
            </label>
            <input
              type="text"
              v-model="lastName"
              required
              class="px-4 py-2 border border-solid border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="نام خانوادگی را وارد کنید"
            />
            <span v-if="errors.lastName" class="text-red-500 text-xs mt-1">{{ errors.lastName }}</span>
          </div>
        </div>

        <div class="flex flex-col w-full">
          <label class="text-sm font-medium text-gray-700 mb-2">
            نام کاربری *
          </label>
          <input
            type="text"
            v-model="userName"
            required
            class="px-4 py-2 border border-solid border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="نام کاربری را وارد کنید"
          />
          <span v-if="errors.userName" class="text-red-500 text-xs mt-1">{{ errors.userName }}</span>
        </div>

        <div class="flex flex-col w-full">
          <label class="text-sm font-medium text-gray-700 mb-2">
            شماره تماس *
          </label>
          <input
            type="text"
            v-model="mobile"
            required
            class="px-4 py-2 border border-solid border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="شماره تماس را وارد کنید"
          />
          <span v-if="errors.mobile" class="text-red-500 text-xs mt-1">{{ errors.mobile }}</span>
        </div>

        <div class="flex flex-col w-full">
          <label class="text-sm font-medium text-gray-700 mb-2">
            رمز عبور *
          </label>
          <input
            type="password"
            v-model="password"
            required
            class="px-4 py-2 border border-solid border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="رمز عبور را وارد کنید"
          />
          <span v-if="errors.password" class="text-red-500 text-xs mt-1">{{ errors.password }}</span>
        </div>

        <div class="flex flex-col w-full">
          <label class="text-sm font-medium text-gray-700 mb-2">
            تکرار رمز عبور *
          </label>
          <input
            type="password"
            v-model="confirmPassword"
            required
            class="px-4 py-2 border border-solid border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="رمز عبور را مجدداً وارد کنید"
          />
          <span v-if="errors.confirmPassword" class="text-red-500 text-xs mt-1">{{ errors.confirmPassword }}</span>
        </div>

        <div class="flex items-center gap-3 pt-4">
          <button
            type="submit"
            class="flex-1 relative bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium cursor-pointer border-none"
            :class="{ 'opacity-70 cursor-not-allowed': isLoading }"
            :disabled="isLoading"
          >
            <span>افزودن کاربر</span>
            <CircleLoading
              v-if="isLoading"
              class="absolute inset-0 mx-auto right-26 top-2 w-6 h-6"
            />
          </button>
          <button
            type="button"
            @click="emit('close')"
            class="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg hover:bg-gray-200 transition-colors font-medium cursor-pointer border-none"
          >
            انصراف
          </button>
        </div>
      </form>
    </div>
  </div>
</template>