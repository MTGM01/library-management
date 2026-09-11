<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { storeToRefs } from "pinia";
import BookGrid from "../components/BookGrid.vue";
import Footer from "../components/Footer.vue";
import Header from "../components/Header.vue";
import Sidebar from "../components/Sidebar.vue";
import AddBookModal from "../components/AddBookModal.vue";
import UserManagement from "../components/icons/UserManagement.vue";
import { RouterLink } from "vue-router";
import { useAuthStore } from "../repository/authStore";
import { type Category, useBooksStore } from "../repository/booksStore";

const openAddNewBookModal = ref(false);
const authStore = useAuthStore();
const booksStore = useBooksStore();
const { profile, role, isAdmin, mobile } = storeToRefs(authStore);
const { books, searchQuery, filteredBooks } = storeToRefs(booksStore);
const canSwitchRole = computed(() => profile.value?.role === "ADMIN");

onMounted(() => {
  booksStore.fetchBooks();
});
</script>

<template>
  <main class="flex flex-col w-full">
    <Header
      :show-switch-role="canSwitchRole"
      :user-name="profile?.userName ?? ''"
      :user-role="role ?? 'USER'"
      :mobile="mobile"
      v-model="searchQuery"
    />
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
          <div class="flex items-center gap-3" v-if="isAdmin">
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
          <RouterLink v-else to="/my-reservations" class="decoration-none">
            <button
              type="button"
              class="w-fit flex items-center gap-2 px-6 py-3 border-none bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
            >
              <UserManagement class="w-5 h-5" />
              <span>رزرو های من</span>
            </button>
          </RouterLink>
        </div>
        <BookGrid :books="filteredBooks" />
      </div>
      <Sidebar
        :books
        @select="(categoryValue: Category) => booksStore.fetchBooks(categoryValue)"
      />
    </div>
    <Footer />
  </main>
  <AddBookModal
    dir="rtl"
    :is-open="openAddNewBookModal"
    @close="openAddNewBookModal = false"
  />
</template>
