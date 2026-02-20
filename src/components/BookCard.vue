<script setup lang="ts">
import ImageWithFallback from "./ImageWithFallback.vue";
import type { BookProps } from "../repository/book";
import EditBook from "./icons/EditBook.vue";
import RemoveBook from "./icons/RemoveBook.vue";
import { convertToCategoryName } from "../helper/showCategory";
import { computed, ref } from "vue";
import { User_GetRole } from "../repository/keyval/userRole";
import type { UserRole } from "../repository/user";
import UpdateBookModal from "./UpdateBookModal.vue";

const { book } = defineProps<{
  book: BookProps;
  userRole: UserRole;
}>();

const openUpdateBookModal = ref(false);

const bookImageMap: Record<string, string> = {
  "computer-programming-book":
    "https://images.unsplash.com/photo-1732304722020-be33345c00c3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21wdXRlciUyMHByb2dyYW1taW5nJTIwYm9va3xlbnwxfHx8fDE3NzAyODI5NDR8MA&ixlib=rb-4.1.0&q=80&w=1080",
  "classic-literature-book":
    "https://images.unsplash.com/photo-1760120482171-d9d5468f75fd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjbGFzc2ljJTIwbGl0ZXJhdHVyZSUyMGJvb2t8ZW58MXx8fHwxNzcwMjcxMjUwfDA&ixlib=rb-4.1.0&q=80&w=1080",
  "ancient-history-book":
    "https://images.unsplash.com/photo-1768927124431-77a94b280be6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbmNpZW50JTIwaGlzdG9yeSUyMGJvb2t8ZW58MXx8fHwxNzcwMzA3MDgzfDA&ixlib=rb-4.1.0&q=80&w=1080",
  "physics-textbook":
    "https://images.unsplash.com/photo-1626885228113-0ac4b52e6cea?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaHlzaWNzJTIwdGV4dGJvb2t8ZW58MXx8fHwxNzcwMjc3MTAwfDA&ixlib=rb-4.1.0&q=80&w=1080",
  "fantasy-fiction-book":
    "https://images.unsplash.com/photo-1760448847959-bd3aec9e672c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYW50YXN5JTIwZmljdGlvbiUyMGJvb2t8ZW58MXx8fHwxNzcwMjk4NjI0fDA&ixlib=rb-4.1.0&q=80&w=1080",
  "psychology-book":
    "https://images.unsplash.com/photo-1549186723-be943b08f2c9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwc3ljaG9sb2d5JTIwYm9va3xlbnwxfHx8fDE3NzAzMDcwODR8MA&ixlib=rb-4.1.0&q=80&w=1080",
};

const isAvailable = computed(() => book.availableCount > 0);
</script>

<template>
  <div
    class="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow border border-solid border-gray-200 overflow-hidden group"
  >
    <div
      class="relative flex items-center justify-center h-64 bg-gray-100 overflow-hidden"
    >
      <div
        v-if="User_GetRole() === 'ADMIN'"
        class="h-8 absolute top-3 left-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <button
          type="button"
          class="bg-white p-2 rounded-lg shadow-md hover:bg-red-50 transition-colors border-none cursor-pointer"
          title="حذف"
        >
          <RemoveBook class="w-4 h-4 text-red-600" />
        </button>
        <button
          type="button"
          @click="openUpdateBookModal = true"
          class="bg-white p-2 rounded-lg shadow-md hover:bg-blue-50 transition-colors border-none cursor-pointer"
          title="ویرایش"
        >
          <EditBook class="w-4 h-4 text-blue-600" />
        </button>
      </div>
      <div class="absolute top-3 right-3">
        <span
          dir="rtl"
          class="px-3 py-1 rounded-full text-xs font-medium"
          :class="
            isAvailable
              ? 'bg-green-100 text-green-700'
              : 'bg-red-100 text-red-700'
          "
        >
          {{
            isAvailable
              ? `${book.availableCount.toLocaleString("fa")} نسخه موجود`
              : "ناموجود"
          }}
        </span>
      </div>
      <ImageWithFallback
        :src="bookImageMap['computer-programming-book']"
        :alt="book.title"
        className="w-full h-full object-cover"
      />
    </div>

    <div class="p-5">
      <div class="mb-3 text-right">
        <span
          class="inline-block px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-md mb-2"
        >
          {{ convertToCategoryName(book.category) }}
        </span>
        <h3 class="font-bold text-lg text-gray-900 mb-1 line-clamp-1">
          {{ book.title }}
        </h3>
        <p class="text-sm text-gray-600 mb-2">{{ book.author }} :نویسنده</p>
        <p class="text-sm text-gray-500 line-clamp-2">
          {{ book.description }}
        </p>
      </div>

      <div
        class="flex items-center gap-4 text-sm text-gray-600 mb-4 pb-4 border-b border-b-solid border-gray-100"
      >
        <div class="flex items-center gap-1">
          <span class="font-medium">ISBN:</span>
          <span class="text-xs">{{ book.ISBN }}</span>
        </div>
      </div>

      <!-- {/* دکمه رزرو */}
        {userRole !== 'admin' && (
          <button
            onClick={() => onReserve(book.id)}
            disabled={!isAvailable}
            class={`w-full py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${
              isAvailable
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
          >
            <Calendar class="w-4 h-4" />
            {isAvailable ? 'رزرو کتاب' : 'در حال حاضر موجود نیست'}
          </button>
        )}

        {/* نمایش تعداد کل برای Admin */}
        {userRole === 'admin' && (
          <div class="bg-gray-50 p-3 rounded-lg">
            <div class="flex justify-between text-sm">
              <span class="text-gray-600">موجود:</span>
              <span class="font-bold text-green-600">{book.availableCopies}</span>
            </div>
            <div class="flex justify-between text-sm mt-1">
              <span class="text-gray-600">مجموع:</span>
              <span class="font-bold text-gray-900">{book.totalCopies}</span>
            </div>
          </div>
        )} -->
    </div>
  </div>
  <UpdateBookModal
    dir="rtl"
    :book
    :isOpen="openUpdateBookModal"
    @close="openUpdateBookModal = false"
  />
</template>
