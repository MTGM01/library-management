<script setup lang="ts">
import ImageWithFallback from "./ImageWithFallback.vue";
import type { BookProps } from "../repository/booksStore";
import EditBook from "./icons/EditBook.vue";
import RemoveBook from "./icons/RemoveBook.vue";
import { convertToCategoryName } from "../helper/showCategory";
import { computed, onUnmounted, ref } from "vue";
import UpdateBookModal from "./UpdateBookModal.vue";
import Calendar from "./icons/Calendar.vue";
import RemoveConfirm from "./RemoveConfirm.vue";
import { showToast } from "../helper/showToast";
import { isSessionRevokedError } from "../helper/sessionError";
import {
  SERVER_ERROR_MESSAGE,
  getNetworkErrorMessage,
  isNetworkError,
  isServerError,
} from "../helper/httpError";
import CircleLoading from "./CircleLoading.vue";
import { useAuthStore } from "../repository/authStore";
import { useBooksStore } from "../repository/booksStore";

const { book } = defineProps<{
  book: BookProps;
}>();

const authStore = useAuthStore();
const booksStore = useBooksStore();
const openUpdateBookModal = ref(false);
const openRemoveBookModal = ref(false);
const isRemoveLoading = ref(false);
const isReserveLoading = ref(false);
const pendingReservation = ref(false);
const countdown = ref(0);
let reserveTimer: ReturnType<typeof setTimeout> | null = null;
let countdownInterval: ReturnType<typeof setInterval> | null = null;
const isAvailable = computed(() => book.availableCount > 0);
const canNotReserve = computed(() =>
  authStore.profile?.reservedBooks.some(
    (reservedBook) => reservedBook === book._id,
  ),
);
const defaultBookImage =
  "https://placehold.co/400x600/e2e8f0/64748b?text=No+Cover";
const bookImageUrl = computed(() =>
  book.coverImage
    ? `http://localhost:4000/uploads/book-covers/${book.coverImage}`
    : defaultBookImage,
);

async function handleRemoveBook() {
  try {
    isRemoveLoading.value = true;
    const result = await booksStore.removeBook({
      id: book._id,
    });
    showToast(
      "success",
      result.message === "The Book Removed Successfully"
        ? "کتاب با موفقیت حذف شد"
        : result.message,
    );
  } catch (error: any) {
    console.error(error);
    if (isSessionRevokedError(error)) return;
    if (isServerError(error)) {
      showToast("error", SERVER_ERROR_MESSAGE);
    } else if (isNetworkError(error)) {
      showToast("error", getNetworkErrorMessage());
    } else {
      showToast("error", "خطا در حذف کتاب");
    }
  } finally {
    isRemoveLoading.value = false;
  }
}

function clearTimers() {
  if (reserveTimer) {
    clearTimeout(reserveTimer);
    reserveTimer = null;
  }
  if (countdownInterval) {
    clearInterval(countdownInterval);
    countdownInterval = null;
  }
  countdown.value = 0;
  pendingReservation.value = false;
}

async function executeReservation() {
  try {
    isReserveLoading.value = true;
    if (!authStore.profile) throw new Error("User profile not found");

    const result = await booksStore.reserveBook({
      userID: authStore.profile._id,
      bookID: book._id,
    });
    authStore.addReservedBook(book._id);
    showToast(
      "success",
      result.message === "The Book Reserved Successfully"
        ? "کتاب با موفقیت رزرو شد"
        : result.message,
    );
  } catch (error: any) {
    console.error(error);
    if (isSessionRevokedError(error)) return;
    if (isServerError(error)) {
      showToast("error", SERVER_ERROR_MESSAGE);
    } else if (isNetworkError(error)) {
      showToast("error", getNetworkErrorMessage());
    } else {
      showToast("error", "خطا در رزرو کتاب");
    }
  } finally {
    isReserveLoading.value = false;
  }
}

function handleReserveBook() {
  if (pendingReservation.value) {
    clearTimers();
    authStore.removeReservedBook(book._id);
    showToast("info", "رزرو کتاب لغو شد");
    return;
  }

  pendingReservation.value = true;
  countdown.value = 10;

  countdownInterval = setInterval(() => {
    countdown.value--;
    if (countdown.value <= 0) {
      if (countdownInterval) clearInterval(countdownInterval);
      countdownInterval = null;
    }
  }, 1000);

  reserveTimer = setTimeout(() => {
    clearTimers();
    executeReservation();
  }, 10000);
}

onUnmounted(() => {
  clearTimers();
});
</script>

<template>
  <div
    dir="rtl"
    class="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow border border-solid border-gray-200 overflow-hidden group"
  >
    <div
      class="relative flex items-center justify-center h-64 bg-gray-100 overflow-hidden"
    >
      <div
        v-if="authStore.role === 'ADMIN'"
        class="h-8 absolute top-3 left-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <button
          type="button"
          @click="openRemoveBookModal = true"
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
        :src="bookImageUrl"
        :alt="book.title"
        className="w-full h-full object-cover"
      />
    </div>

    <div>
      <div class="flex flex-col mb-3 text-right">
        <span
          class="inline-block w-fit mt-5 px-2 py-1 bg-blue-50 text-blue-700 text-sm rounded-md mb-2"
        >
          {{ convertToCategoryName(book.category) }}
        </span>
        <h3
          :title="book.title"
          class="font-bold text-lg text-gray-900 mb-1 min-w-0 grow truncate"
        >
          {{ book.title }}
        </h3>
        <p
          :title="book.author"
          class="flex items-center gap-1 text-sm text-gray-600 mb-2"
        >
          <span>نویسنده:</span>
          <span>
            {{ book.author }}
          </span>
        </p>
        <p
          :title="book.description"
          class="text-sm text-gray-500 my-0 min-h-5 min-w-0 grow truncate"
        >
          {{ book.description }}
        </p>
        <div
          class="flex items-center text-sm text-gray-600 mb-4 mt-2 pb-4 border-b border-b-solid border-gray-100"
        >
          <div class="flex items-center gap-1">
            <span class="font-medium">ISBN:</span>
            <span :title="book.ISBN">{{ book.ISBN }}</span>
          </div>
        </div>
      </div>

      <button
        v-if="authStore.role === 'USER'"
        class="flex items-center justify-center gap-2 w-full py-3 relative rounded-lg transition-colors font-medium border-none"
        :class="
          !isAvailable || isReserveLoading
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
            : pendingReservation
              ? 'bg-amber-500 text-white hover:bg-amber-600 cursor-pointer'
              : canNotReserve
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700 cursor-pointer'
        "
        @click="handleReserveBook"
        :disabled="!isAvailable || isReserveLoading || canNotReserve"
      >
        <Calendar class="w-4 h-4" />
        <span>
          {{
            pendingReservation
              ? `لغو رزرو (${countdown} ثانیه)`
              : canNotReserve
                ? "این کتاب قبلا رزرو شده است"
                : isAvailable
                  ? "رزرو کتاب"
                  : "در حال حاضر موجود نیست"
          }}
        </span>
        <CircleLoading
          v-if="isReserveLoading"
          class="absolute inset-0 mx-auto right-32 top-2 w-6 h-6"
        />
      </button>

      <div v-if="authStore.role === 'ADMIN'" class="bg-gray-50 p-3 rounded-lg">
        <div class="flex justify-between text-sm">
          <span class="text-gray-600">موجود:</span>
          <span class="font-bold text-green-600">
            {{ book.availableCount.toLocaleString("fa") }}
          </span>
        </div>
        <div class="flex justify-between text-sm mt-1">
          <span class="text-gray-600">مجموع:</span>
          <span class="font-bold text-gray-900">
            {{ book.total.toLocaleString("fa") }}
          </span>
        </div>
      </div>
    </div>
  </div>
  <UpdateBookModal
    dir="rtl"
    :book="book"
    :isOpen="openUpdateBookModal"
    @close="openUpdateBookModal = false"
  />
  <RemoveConfirm
    :isOpen="openRemoveBookModal"
    :bookTitle="book.title"
    :isLoading="isRemoveLoading"
    @close="openRemoveBookModal = false"
    @confirm="handleRemoveBook"
  />
</template>
