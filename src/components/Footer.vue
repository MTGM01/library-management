<script setup lang="ts">
import BookOpen from "./icons/BookOpen.vue";
import Mail from "./icons/Mail.vue";
import MapPin from "./icons/MapPin.vue";
import Phone from "./icons/phone.vue";

// import { BookOpen, Mail, Phone, MapPin } from "lucide-react";

// export function Footer() {
//   return (

//   );
// }
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
              <a>همه کتاب‌ها</a>
            </li>
            <li
              class="mb-2 hover:text-blue-400 transition-colors cursor-pointer"
            >
              <a>دسته‌بندی‌ها</a>
            </li>
            <li
              class="mb-2 hover:text-blue-400 transition-colors cursor-pointer"
            >
              <a>رزروهای من</a>
            </li>
            <li
              class="mb-2 hover:text-blue-400 transition-colors cursor-pointer"
            >
              <a>راهنما</a>
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
  </footer>
</template>
