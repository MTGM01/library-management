<script setup lang="ts">
import { computed, ref, watch } from "vue";
import Close from "./icons/Close.vue";
import BookOpen from "./icons/BookOpen.vue";
import CircleLoading from "./CircleLoading.vue";
import { API_Deliver_Book } from "../datasource/ReserveBookAPI";
import { showToast } from "../helper/showToast";
import { isSessionRevokedError } from "../helper/sessionError";
import {
  SERVER_ERROR_MESSAGE,
  getNetworkErrorMessage,
  isNetworkError,
  isServerError,
} from "../helper/httpError";
import type { UserProps } from "../repository/authStore";
import type { BookProps } from "../repository/booksStore";

interface Props {
  isOpen: boolean;
  user: UserProps | null;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  (event: "close"): void;
  (event: "deliver"): void;
}>();

const localUser = ref<UserProps | null>(null);
const deliveringBookId = ref<string | null>(null);

const syncLocalUser = (newUser: UserProps | null) => {
  localUser.value = newUser
    ? { ...newUser, reservedBooks: [...newUser.reservedBooks] }
    : null;
};

watch(
  [() => props.user, () => props.isOpen],
  ([newUser, isOpen]) => {
    if (isOpen) syncLocalUser(newUser);
    else if (newUser === null) syncLocalUser(null);
  },
  { immediate: true },
);

const reservedBooksList = computed(() => {
  if (!localUser.value) return [];
  return localUser.value.reservedBooks.filter(
    (book): book is BookProps =>
      typeof book === "object" && book !== null && "_id" in book,
  );
});

const handleDeliver = async (book: BookProps) => {
  if (!localUser.value || deliveringBookId.value) return;

  deliveringBookId.value = book._id;
  try {
    await API_Deliver_Book({ userID: localUser.value._id, bookID: book._id });
    localUser.value = {
      ...localUser.value,
      reservedBooks: localUser.value.reservedBooks.filter(
        (b) => (typeof b === "object" && b !== null ? b._id : b) !== book._id,
      ),
    };
    showToast("success", "کتاب با موفقیت تحویل داده شد");
    emit("deliver");
  } catch (error: any) {
    console.error(error);
    if (isSessionRevokedError(error)) return;
    if (isServerError(error)) {
      showToast("error", SERVER_ERROR_MESSAGE);
    } else if (isNetworkError(error)) {
      showToast("error", getNetworkErrorMessage());
    } else if (error.message && error.message.includes("404")) {
      showToast("error", "رزرو یافت نشد");
    } else {
      showToast("error", "خطا در تحویل کتاب");
    }
  } finally {
    deliveringBookId.value = null;
  }
};
</script>

<template>
  <div
    v-if="isOpen"
    @click.self="emit('close')"
    class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
  >
    <div
      class="bg-white rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
      dir="rtl"
    >
      <div
        class="sticky top-0 bg-white border-b border-b-solid border-gray-200 px-6 py-4 flex items-center justify-between"
      >
        <h2 class="text-xl my-0 font-bold text-gray-900">
          رزروهای فعال
          <span v-if="localUser" class="text-sm font-normal text-gray-500 mr-1">
            — {{ localUser.firstName }} {{ localUser.lastName }}
          </span>
        </h2>
        <button
          @click="emit('close')"
          class="p-2 hover:bg-gray-100 rounded-lg transition-colors border-none bg-transparent cursor-pointer"
        >
          <Close class="w-5 h-5 text-gray-600" />
        </button>
      </div>

      <div v-if="localUser" class="p-6">
        <div v-if="reservedBooksList.length > 0" class="space-y-3">
          <div
            v-for="book in reservedBooksList"
            :key="book._id"
            class="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100"
          >
            <div class="flex-1">
              <p class="font-medium text-gray-900 my-0">{{ book.title }}</p>
              <p class="text-sm text-gray-500 my-0 mt-1">{{ book.author }}</p>
            </div>
            <button
              type="button"
              class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors border-none cursor-pointer text-sm font-medium flex items-center gap-2"
              :disabled="deliveringBookId !== null"
              :class="{
                'opacity-50 cursor-not-allowed': deliveringBookId !== null,
              }"
              @click="handleDeliver(book)"
            >
              <CircleLoading
                v-if="deliveringBookId === book._id"
                class="w-4 h-4"
              />
              <span>تحویل</span>
            </button>
          </div>
        </div>

        <div v-else class="text-center py-8 text-gray-500">
          <BookOpen class="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p class="my-0">هیچ رزرو فعالی وجود ندارد</p>
        </div>
      </div>

      <div v-else class="p-6 text-center text-gray-500">در حال بارگذاری...</div>
    </div>
  </div>
</template>
