<script setup lang="ts">
import { ref } from "vue";
import { RouterLink } from "vue-router";
import BookOpen from "./icons/BookOpen.vue";
import Close from "./icons/Close.vue";
import Mail from "./icons/Mail.vue";
import MapPin from "./icons/MapPin.vue";
import Phone from "./icons/phone.vue";
import { useBooksStore } from "../repository/booksStore";

const booksStore = useBooksStore();
const showGuide = ref(false);

function showAllBooks() {
  if (booksStore.selectedCategory === "all") return;
  booksStore.fetchBooks("all").catch(() => {});
}
</script>

<template>
  <footer class="w-full bg-gray-900 text-gray-300">
    <div class="mx-auto px-6 py-12">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div class="flex flex-col items-end">
          <h3 class="font-bold text-white my-0 mb-4">تماس با ما</h3>
          <ul
            class="flex flex-col items-end text-sm my-0 list-none p-0 text-right"
          >
            <li class="flex items-center gap-2 mb-2">
              <span>مشهد ، خیابان دانشگاه ، کتابخانه مرکزی</span>
              <MapPin class="w-4 h-4 text-blue-400" />
            </li>
            <li class="flex items-center gap-2 mb-2">
              <span dir="ltr">051-1234-5678</span>
              <Phone class="w-4 h-4 text-blue-400" />
            </li>
            <li class="flex items-center gap-2 mb-2">
              <span>info@library.ir</span>
              <Mail class="w-4 h-4 text-blue-400" />
            </li>
          </ul>
        </div>

        <div class="flex flex-col items-end">
          <h3 class="font-bold text-white my-0 mb-4">دسترسی سریع</h3>
          <ul class="text-sm list-none p-0 my-0 text-right my-0">
            <li
              class="mb-2 hover:text-blue-400 transition-colors cursor-pointer"
            >
              <RouterLink
                to="/"
                class="decoration-none text-inherit"
                @click="showAllBooks"
              >
                همه کتاب‌ها
              </RouterLink>
            </li>
            <li
              class="mb-2 hover:text-blue-400 transition-colors cursor-pointer"
            >
              <RouterLink
                :to="{ path: '/', hash: '#categories' }"
                class="decoration-none text-inherit"
              >
                دسته‌بندی‌ها
              </RouterLink>
            </li>
            <li
              class="mb-2 hover:text-blue-400 transition-colors cursor-pointer"
            >
              <RouterLink
                :to="{ name: 'my-reservations' }"
                class="decoration-none text-inherit"
              >
                رزروهای من
              </RouterLink>
            </li>
            <li
              class="mb-2 hover:text-blue-400 transition-colors cursor-pointer"
            >
              <a @click="showGuide = true">راهنما</a>
            </li>
          </ul>
        </div>

        <div class="flex flex-col items-end">
          <div class="flex items-center gap-2 mb-4">
            <h3 class="font-bold text-white my-0">سیستم مدیریت کتابخانه</h3>
            <div class="bg-blue-600 p-2 rounded-lg flex items-center">
              <BookOpen class="w-5 h-5 text-white" />
            </div>
          </div>
          <p
            class="text-sm text-gray-400 leading-relaxed my-0 text-right pl-20"
          >
            یک سیستم جامع برای مدیریت کتابخانه با امکان رزرو آنلاین کتاب‌ها ،
            جستجوی پیشرفته و مدیریت موجودی
          </p>
        </div>
      </div>

      <div
        class="border-t border-t-solid border-gray-800 mt-8 pt-8 text-center text-sm text-gray-500"
      >
        <p>© 2026 سیستم مدیریت کتابخانه تمامی حقوق محفوظ است</p>
      </div>
    </div>

    <div
      v-if="showGuide"
      @click.self="showGuide = false"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      dir="rtl"
    >
      <div class="bg-white rounded-xl shadow-xl max-w-lg w-full p-6">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xl font-bold text-gray-900 my-0">راهنمای استفاده</h2>
          <button
            type="button"
            @click="showGuide = false"
            class="p-2 hover:bg-gray-100 rounded-lg transition-colors border-none bg-transparent cursor-pointer"
          >
            <Close class="w-5 h-5 text-gray-600" />
          </button>
        </div>
        <ol class="text-sm text-gray-700 leading-loose my-0 pr-5">
          <li>
            از بخش «همه کتاب‌ها» کتاب مورد نظر را جست‌وجو کنید یا با
            «دسته‌بندی‌ها» نتیجه را بر اساس موضوع فیلتر کنید.
          </li>
          <li>
            برای رزرو، دکمه «رزرو کتاب» را بزنید و رزرو را ظرف ۱۰ ثانیه تأیید
            کنید.
          </li>
          <li>کتاب‌های رزروشده را در بخش «رزروهای من» مشاهده کنید.</li>
          <li>
            در صورت مسدود شدن حساب کاربری، برای رفع آن به صورت حضوری به کتابخانه
            مراجعه کنید.
          </li>
        </ol>
      </div>
    </div>
  </footer>
</template>
