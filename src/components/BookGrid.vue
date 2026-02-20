<script setup lang="ts">
import BookCard from "./BookCard.vue";
import type { BookProps } from "../repository/book";
import BookNotFound from "./icons/BookNotFound.vue";
import type { User } from "../repository/user";

const { books, user } = defineProps<{
  books: BookProps[] | null;
  user: User;
}>();
</script>

<template>
  <div v-if="books?.length === 0" class="text-center py-16 mx-auto w-full">
    <BookNotFound class="w-24 h-24 mx-auto text-gray-400 mb-4" />
    <h3 class="text-xl font-medium text-gray-900 mb-2">کتابی یافت نشد</h3>
    <p class="text-gray-500">لطفاً فیلترها یا جستجوی خود را تغییر دهید</p>
  </div>

  <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    <BookCard
      v-for="book in books"
      :key="book.ISBN"
      :book
      :userRole="user.userRole"
    />
  </div>
</template>
