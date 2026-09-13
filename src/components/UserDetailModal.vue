<script setup lang="ts">
import { computed } from "vue";
import Close from "./icons/Close.vue";
import Calendar from "./icons/Calendar.vue";
import phone from "./icons/phone.vue";
import BookOpen from "./icons/BookOpen.vue";
import UserCheck from "./icons/UserCheck.vue";
import UserCross from "./icons/UserCross.vue";
import { convertISOToJalali } from "../utils/convertDate";
import type { UserProps, UserStatus } from "../repository/authStore";

interface Props {
  isOpen: boolean;
  user: UserProps | null;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  (event: "close"): void;
}>();

const statusColor = computed(() => {
  if (!props.user) return "";
  return props.user.status === "ACTIVE" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700";
});

const statusIcon = computed(() => {
  if (!props.user) return UserCheck;
  return props.user.status === "ACTIVE" ? UserCheck : UserCross;
});

const statusText = computed(() => {
  if (!props.user) return "";
  return props.user.status === "ACTIVE" ? "فعال" : "مسدود";
});

const roleColor = computed(() => {
  if (!props.user) return "";
  return props.user.role === "ADMIN" ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700";
});

const roleText = computed(() => {
  if (!props.user) return "";
  return props.user.role === "ADMIN" ? "مدیر" : "کاربر";
});
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
        <h2 class="text-xl my-0 font-bold text-gray-900">جزئیات کاربر</h2>
        <button
          @click="emit('close')"
          class="p-2 hover:bg-gray-100 rounded-lg transition-colors border-none bg-transparent cursor-pointer"
        >
          <Close class="w-5 h-5 text-gray-600" />
        </button>
      </div>

      <div v-if="user" class="p-6 space-y-6">
        <div class="flex items-center gap-4">
          <div class="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
            <span class="text-blue-600 font-bold text-2xl">
              {{ user.firstName.charAt(0) }}
            </span>
          </div>
          <div class="flex-1">
            <h3 class="text-xl font-bold text-gray-900">
              {{ user.firstName }} {{ user.lastName }}
            </h3>
            <div class="flex items-center gap-3 mt-2">
              <span :class="['px-3 py-1 rounded-full text-sm font-medium', statusColor]">
                <component :is="statusIcon" class="w-4 h-4 inline-block ml-1" />
                {{ statusText }}
              </span>
              <span :class="['px-3 py-1 rounded-full text-sm font-medium', roleColor]">
                {{ roleText }}
              </span>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-4 border-t border-gray-200 pt-6">
          <div>
            <label class="text-sm font-medium text-gray-500">نام کاربری</label>
            <p class="text-gray-900 mt-1">{{ user.userName }}</p>
          </div>
          <div>
            <label class="text-sm font-medium text-gray-500">شماره تماس</label>
            <p class="text-gray-900 mt-1 flex items-center gap-2">
              <phone class="w-4 h-4 text-gray-400" />
              <span dir="ltr">{{ user.mobile }}</span>
            </p>
          </div>
          <div>
            <label class="text-sm font-medium text-gray-500">تاریخ عضویت</label>
            <p class="text-gray-900 mt-1 flex items-center gap-2">
              <Calendar class="w-4 h-4 text-gray-400" />
              <span>{{ convertISOToJalali(user.createdAt) }}</span>
            </p>
          </div>
          <div>
            <label class="text-sm font-medium text-gray-500">رصید جرایم</label>
            <p class="text-gray-900 mt-1">{{ user.crime }}</p>
          </div>
          <div class="col-span-2">
            <label class="text-sm font-medium text-gray-500">رزروهای فعال</label>
            <p class="text-gray-900 mt-1 flex items-center gap-2">
              <BookOpen class="w-4 h-4 text-gray-400" />
              <span>{{ user.reservedBooks.length }} کتاب</span>
            </p>
          </div>
          <div class="col-span-2">
            <label class="text-sm font-medium text-gray-500">آخرین بروزرسانی</label>
            <p class="text-gray-900 mt-1">
              {{ convertISOToJalali(user.updatedAt) }}
            </p>
          </div>
        </div>
      </div>

      <div v-else class="p-6 text-center text-gray-500">
        در حال بارگذاری...
      </div>
    </div>
  </div>
</template>