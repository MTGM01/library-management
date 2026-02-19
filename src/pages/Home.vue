<script setup lang="ts">
import { ref, watchEffect } from "vue";
import BookGrid from "../components/BookGrid.vue";
import Footer from "../components/Footer.vue";
import Header from "../components/Header.vue";
import { Book, type Category, type BookProps } from "../repository/book";
import Sidebar from "../components/Sidebar.vue";
import { User } from "../repository/user";
import { User_GetProfile } from "../repository/keyval/userProfile";
import AddBookModal from "../components/AddBookModal.vue";

const openAddNewBookModal = ref(false);
const books = ref<BookProps[] | null>(null);
const category = ref<Category>("all");
const user = ref<User>(new User(User_GetProfile()));

watchEffect(async () => {
  books.value = (await Book.getList(category.value)).result;
});
</script>

<template>
  <main class="flex flex-col w-full">
    <Header :user />
    <div class="flex grow justify-end">
      <div class="flex flex-col m-6">
        <button
          type="button"
          class="w-fit flex items-center gap-2 px-6 py-3 mb-6 border-none bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
          @click="openAddNewBookModal = true"
        >
          <span>+</span>
          <span>افزودن کتاب جدید</span>
        </button>
        <BookGrid :books />
      </div>
      <Sidebar
        @select="(categoryValue: Category) => (category = categoryValue)"
      />
    </div>
    <Footer />
  </main>
  <AddBookModal
    dir="rtl"
    :isOpen="openAddNewBookModal"
    @close="openAddNewBookModal = false"
  />
</template>
