<script setup lang="ts">
import { computed, provide, ref, watchEffect } from "vue";
import BookGrid from "../components/BookGrid.vue";
import Footer from "../components/Footer.vue";
import Header from "../components/Header.vue";
import { Book, type Category, type BookProps } from "../repository/book";
import Sidebar from "../components/Sidebar.vue";
import { User } from "../repository/user";
import { User_GetProfile } from "../repository/keyval/userProfile";
import AddBookModal from "../components/AddBookModal.vue";
import UserManagement from "../components/icons/UserManagement.vue";
import { RouterLink } from "vue-router";
import { User_GetRole } from "../repository/keyval/userRole";

const openAddNewBookModal = ref(false);
const searchedBook = ref("");
const books = ref<BookProps[] | null>(null);
const category = ref<Category>("all");
const user = ref<User>(
  new User({ ...User_GetProfile(), role: User_GetRole() }),
);
const filteredBooks = computed(() => {
  if (!books.value) return null;
  if (!searchedBook.value.trim()) return books.value;
  return books.value.filter((book) =>
    book.title.toLowerCase().includes(searchedBook.value.trim().toLowerCase()),
  );
});

function updateList(booksList: BookProps[] | null) {
  books.value = booksList;
}

provide("user", user);
provide("updateList", updateList);
provide("selectedCategory", category);

watchEffect(async () => {
  books.value = (await Book.getList(category.value)).result;
});
</script>

<template>
  <main class="flex flex-col w-full">
    <Header v-model="searchedBook" :user />
    <div class="flex grow justify-end">
      <div class="flex flex-col m-6 w-full">
        <div dir="rtl" class="flex justify-between items-center mb-6">
          <div class="flex flex-col text-right">
            <h1 class="text-3xl font-bold mt-0 mb-2 text-gray-900">
              کتابخانه دیجیتال
            </h1>
            <p class="text-gray-600 my-0">
              {{ filteredBooks?.length }} کتاب یافت شد
            </p>
          </div>
          <div class="flex items-center gap-3" v-if="user.userRole === 'ADMIN'">
            <RouterLink to="/users" class="decoration-none">
              <button
                type="button"
                class="bg-white border-2 border-solid border-blue-600 text-blue-600 px-6 py-3 rounded-lg hover:bg-blue-50 transition-colors flex items-center gap-2 cursor-pointer"
              >
                <UserManagement class="w-5 h-5" />
                <span>مدیریت کاربران</span>
              </button>
            </RouterLink>
            <button
              type="button"
              class="w-fit flex items-center gap-2 px-6 py-3 border-none bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
              @click="openAddNewBookModal = true"
            >
              <span>+</span>
              <span>افزودن کتاب جدید</span>
            </button>
          </div>
        </div>
        <BookGrid :books="filteredBooks" :user />
      </div>
      <Sidebar
        :books
        @select="(categoryValue: Category) => (category = categoryValue)"
      />
    </div>
    <Footer />
  </main>
  <AddBookModal
    dir="rtl"
    :is-open="openAddNewBookModal"
    :selected-category="category"
    @add="(data) => (books = data.result)"
    @close="openAddNewBookModal = false"
  />
</template>
