<script setup lang="ts">
import { ref, watchEffect } from "vue";
import BookGrid from "../components/BookGrid.vue";
import Footer from "../components/Footer.vue";
import Header from "../components/Header.vue";
import { Book, type Category, type BookProps } from "../repository/book";
import Sidebar from "../components/Sidebar.vue";
import { User } from "../repository/user";
import { User_GetProfile } from "../repository/keyval/userProfile";

const books = ref<BookProps[] | null>(null);
const category = ref<Category>("all");
const user = new User(User_GetProfile());

watchEffect(async () => {
  books.value = (await Book.getList(category.value)).result;
});
</script>

<template>
  <main class="flex flex-col w-full">
    <Header :user />
    <div class="flex grow justify-end">
      <BookGrid :books class="m-6" />
      <Sidebar
        @select="(categoryValue: Category) => (category = categoryValue)"
      />
    </div>
    <Footer />
  </main>
</template>
