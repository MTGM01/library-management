<script setup lang="ts">
import { computed, onMounted } from "vue";
import { RouterLink } from "vue-router";
import { storeToRefs } from "pinia";
import BookOpen from "../components/icons/BookOpen.vue";
import Header from "../components/Header.vue";
import Footer from "../components/Footer.vue";
import CircleLoading from "../components/CircleLoading.vue";
import ImageWithFallback from "../components/ImageWithFallback.vue";
import { useAuthStore } from "../repository/authStore";
import { useBooksStore, type BookProps } from "../repository/booksStore";

const authStore = useAuthStore();
const booksStore = useBooksStore();
const { profile, role, mobile } = storeToRefs(authStore);
const { books, isLoading } = storeToRefs(booksStore);

const reservedBooks = computed(() => {
  const reservedBookIds = profile.value?.reservedBooks ?? [];
  return (
    books.value?.filter((book) => reservedBookIds.includes(book._id)) ?? []
  );
});

const defaultBookImage =
  "https://placehold.co/400x600/e2e8f0/64748b?text=No+Cover";

function bookCoverUrl(book: BookProps): string {
  return book.coverImage
    ? `http://localhost:4000/uploads/book-covers/${book.coverImage}`
    : defaultBookImage;
}

onMounted(() => {
  booksStore.fetchBooks("all");
});
</script>

<template>
  <div class="min-h-screen flex flex-col bg-gray-50" dir="rtl">
    <Header
      dir="ltr"
      :show-switch-role="profile?.role === 'ADMIN'"
      :user-name="profile?.userName ?? ''"
      :user-role="role ?? 'USER'"
      :mobile="mobile"
      :no-search="true"
    />

    <section class="flex-1 p-6">
      <div class="max-w-7xl mx-auto">
        <RouterLink to="/" class="decoration-none">
          <button
            type="button"
            class="flex items-center gap-2 bg-transparent border-none text-gray-600 hover:text-gray-900 mb-6 transition-colors cursor-pointer"
          >
            <span>بازگشت به کتابخانه</span>
          </button>
        </RouterLink>

        <div class="mb-8">
          <div class="flex items-center gap-3 mb-6">
            <div class="bg-blue-600 px-3 pt-3 pb-2 rounded-xl">
              <BookOpen class="w-7 h-7 text-white" />
            </div>
            <div class="flex flex-col gap-2">
              <h1 class="text-3xl font-bold text-gray-900 my-0">رزروهای من</h1>
              <p class="text-gray-600 my-0">
                مشاهده کتاب‌هایی که با حساب فعلی رزرو شده‌اند
              </p>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="bg-white p-6 rounded-xl border border-solid border-gray-200">
              <div class="flex items-center justify-between">
                <div class="flex flex-col">
                  <span class="text-gray-600 text-sm mb-1">کل رزروها</span>
                  <span class="text-3xl font-bold text-gray-900">
                    {{ reservedBooks.length }}
                  </span>
                </div>
                <BookOpen class="w-10 h-10 text-blue-600" />
              </div>
            </div>
          </div>
        </div>

        <div
          class="bg-white rounded-xl border border-solid border-gray-200 overflow-hidden"
        >
          <div
            class="px-6 py-4 border-b border-b-solid border-gray-200 bg-gray-50"
          >
            <h2 class="text-xl font-bold text-gray-900 my-0">تاریخچه رزروها</h2>
          </div>

          <div v-if="isLoading" class="flex justify-center py-16">
            <CircleLoading class="w-10 h-10 text-blue-600" />
          </div>

          <div v-else-if="reservedBooks.length === 0" class="text-center py-16">
            <BookOpen class="w-20 h-20 text-gray-300 mx-auto mb-4" />
            <h3 class="text-xl font-bold text-gray-700 mb-2">
              هنوز کتابی رزرو نکرده‌اید
            </h3>
            <p class="text-gray-500 mb-6">
              برای رزرو کتاب، به کتابخانه برگردید و کتاب مورد نظر را انتخاب کنید
            </p>
            <RouterLink to="/">
              <button
                type="button"
                class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors border-none cursor-pointer"
              >
                مشاهده کتابخانه
              </button>
            </RouterLink>
          </div>

          <div v-else class="divide-y divide-gray-200">
            <article
              v-for="book in reservedBooks"
              :key="book._id"
              class="p-6 hover:bg-gray-50 transition-colors"
            >
              <div class="flex items-center gap-4">
                <div
                  class="w-20 h-28 rounded-lg overflow-hidden shadow-md shrink-0"
                >
                  <ImageWithFallback
                    :src="bookCoverUrl(book)"
                    :alt="book.title"
                    className="w-full h-full object-cover"
                  />
                </div>

                <div class="flex-1">
                  <h3 class="text-xl font-bold text-gray-900 mb-2">
                    {{ book.title }}
                  </h3>
                  <p class="text-sm text-gray-600 mb-3">
                    نویسنده: {{ book.author }}
                  </p>
                  <p class="text-sm text-gray-500 my-0">
                    ISBN: {{ book.ISBN }}
                  </p>
                </div>

                <span
                  class="px-4 py-2 rounded-lg font-medium bg-blue-100 text-blue-700 border border-solid border-blue-200"
                >
                  رزرو شده
                </span>
              </div>
            </article>
          </div>
        </div>
      </div>
    </section>

    <Footer dir="ltr" />
  </div>
</template>
