<script setup lang="ts">
// import { Book, UserRole } from "../App";
import BookCard from "./BookCard.vue";
import type { BookProps } from "../repository/book";

interface BookGridProps {
  books: BookProps[] | null;
  // userRole?: UserRole;
  // onReserve: ?((bookId: string) => void);
  // onDelete?: (bookId: string) => void;
  // onEdit?: (bookId: string) => void;
}

const { books } = defineProps<BookGridProps>();
</script>

<template>
  <div v-if="books?.length === 0" class="text-center py-16 mx-auto w-full">
    <div class="text-gray-400 mb-4">
      <svg
        class="w-24 h-24 mx-auto"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="{1.5}"
          d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
        />
      </svg>
    </div>
    <h3 class="text-xl font-medium text-gray-900 mb-2">کتابی یافت نشد</h3>
    <p class="text-gray-500">لطفاً فیلترها یا جستجوی خود را تغییر دهید</p>
  </div>

  <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    <BookCard v-for="book in books" :key="book.ISBN" :book />
    <!-- :userRole
      :onReserve
      :onDelete
      :onEdit -->
  </div>
</template>
