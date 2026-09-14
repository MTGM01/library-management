<script setup lang="ts">
import { computed } from "vue";
import { storeToRefs } from "pinia";
import Filter from "./icons/Filter.vue";
import BookOpen from "./icons/BookOpen.vue";
import CircleLoading from "./CircleLoading.vue";
import {
  type BookProps,
  booksCategories,
  type Category,
  useBooksStore,
} from "../repository/booksStore";

const { books, isLoading } = defineProps<{
  books: BookProps[] | null;
  isLoading: boolean;
}>();

const emit = defineEmits<{
  (event: "select", value: Category): void;
}>();

const booksStore = useBooksStore();
const { selectedCategory } = storeToRefs(booksStore);
const categories = computed(() => booksCategories);
const booksTotal = computed(() => {
  if (!books) return 0;
  return books?.reduce((sum, book) => sum + book.total, 0);
});
const availableTotal = computed(() => {
  if (!books) return 0;
  return books?.reduce((sum, book) => sum + book.availableCount, 0);
});
const reservedTotal = computed(() => booksTotal.value - availableTotal.value);

function selectCategory(categoryValue: Category) {
  selectedCategory.value = categoryValue;
  emit("select", categoryValue);
}
</script>

<template>
  <aside
    id="categories"
    class="w-64 bg-white border-l border-l-solid border-gray-200 p-6"
  >
    <div class="sticky top-24">
      <div class="flex items-center justify-end gap-2 mb-6">
        <h2 class="font-bold text-gray-900 my-0">دسته‌بندی‌ها</h2>
        <Filter class="w-5 h-5 text-gray-600" />
      </div>

      <nav class="space-y-2">
        <button
          v-for="category in categories"
          :key="category.value"
          @click="selectCategory(category.value)"
          class="w-full text-right text-16px px-4 py-3 rounded-lg transition-colors border-none outline-none bg-transparent flex items-center justify-end cursor-pointer gap-3"
          :class="
            selectedCategory === category.value
              ? 'bg-blue-50 text-blue-700 font-medium'
              : 'text-gray-700 hover:bg-gray-50'
          "
          :disabled="isLoading"
        >
          <span>{{ category.title }}</span>
          <BookOpen class="w-4 h-4" />
        </button>
      </nav>

      <div v-if="isLoading" class="mt-8 flex justify-center">
        <CircleLoading class="w-8 h-8 text-blue-600" />
      </div>
      <div v-else dir="rtl" class="mt-8 p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
        <h3 class="font-bold text-gray-900 mb-3">آمار کتابخانه</h3>
        <div class="space-y-2 text-sm">
          <div class="flex justify-between">
            <span class="text-gray-600">مجموع کتاب‌ها:</span>
            <span class="font-bold text-blue-600">{{ booksTotal }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-600">رزرو شده:</span>
            <span class="font-bold text-orange-600">{{ reservedTotal }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-600">در دسترس:</span>
            <span class="font-bold text-green-600">{{ availableTotal }}</span>
          </div>
        </div>
      </div>
    </div>
  </aside>
</template>
