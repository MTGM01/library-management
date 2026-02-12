<script lang="ts">
export type Category =
  | "all"
  | "computer"
  | "literature"
  | "history"
  | "sciences"
  | "psychology";

export type CategoryEnum = { title: string; value: string };
</script>

<script setup lang="ts">
import { ref } from "vue";
import Filter from "./icons/Filter.vue";
import BookOpen from "./icons/BookOpen.vue";

const categories: CategoryEnum[] = [
  {
    title: "همه",
    value: "all",
  },
  {
    title: "کامپیوتر",
    value: "computer",
  },
  {
    title: "ادبیات",
    value: "literature",
  },
  {
    title: "تاریخ",
    value: "hystory",
  },
  {
    title: "علوم",
    value: "sciences",
  },
  {
    title: "داستان",
    value: "sciences",
  },
  {
    title: "روانشناسی",
    value: "psychology",
  },
];

const selectedCategory = ref("all");
// interface SidebarProps {
//   categories: string[];
//   selectedCategory: string;
//   onCategoryChange: (category: string) => void;
// }
// export function Sidebar({ categories, selectedCategory, onCategoryChange }: SidebarProps) {
//   return (

//   );
// }
</script>

<template>
  <aside class="w-64 bg-white border-l border-l-solid border-gray-200 p-6">
    <div class="sticky top-24">
      <div class="flex items-center justify-end gap-2 mb-6">
        <h2 class="font-bold text-gray-900">دسته‌بندی‌ها</h2>
        <Filter class="w-5 h-5 text-gray-600" />
      </div>

      <nav class="space-y-2">
        <button
          v-for="category in categories"
          :key="category.value"
          @click="selectedCategory = category.value"
          class="w-full text-right px-4 py-3 rounded-lg transition-colors border-none outline-none bg-transparent flex items-center justify-end cursor-pointer gap-3"
          :class="
            selectedCategory === category.value
              ? 'bg-blue-50 text-blue-700 font-medium'
              : 'text-gray-700 hover:bg-gray-50'
          "
        >
          <span>{{ category.title }}</span>
          <BookOpen class="w-4 h-4" />
        </button>
      </nav>

      <div
        class="mt-8 p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-100"
      >
        <h3 class="font-bold text-gray-900 mb-3">آمار کتابخانه</h3>
        <div class="space-y-2 text-sm">
          <div class="flex justify-between">
            <span class="text-gray-600">مجموع کتاب‌ها:</span>
            <span class="font-bold text-blue-600">1,250</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-600">رزرو شده:</span>
            <span class="font-bold text-orange-600">234</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-600">در دسترس:</span>
            <span class="font-bold text-green-600">1,016</span>
          </div>
        </div>
      </div>
    </div>
  </aside>
</template>
