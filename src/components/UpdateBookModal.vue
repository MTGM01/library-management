<script setup lang="ts">
import { computed, ref } from "vue";
import Close from "./icons/Close.vue";
import CircleLoading from "./CircleLoading.vue";
import { showToast } from "../helper/showToast";
import {
  booksCategories,
  type BookProps,
  type Category,
  useBooksStore,
} from "../repository/booksStore";

const { isOpen, book } = defineProps<{
  isOpen: boolean;
  book: BookProps;
}>();

const emit = defineEmits<{
  (event: "close"): void;
}>();

const baseApi = "http://localhost:4000";
const booksStore = useBooksStore();
const isLoading = ref(false);
const title = ref(book.title);
const author = ref(book.author);
const category = ref<Category>(book.category);
const isbn = ref(book.ISBN);
const total = ref(book.total);
const availableCount = ref(book.availableCount);
const description = ref(book.description);
const coverImageFile = ref<File | null>(null);
const coverImagePreview = ref(
  book.coverImage ? `${baseApi}/uploads/book-covers/${book.coverImage}` : "",
);
const currentCoverImage = ref(book.coverImage || "");
const removeCover = ref(false);
const categories = computed(() => booksCategories);

function handleFileChange(event: Event) {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  if (file) {
    if (file.size > 5 * 1024 * 1024) {
      showToast("error", "حجم تصویر نباید بیشتر از ۵ مگابایت باشد");
      return;
    }
    coverImageFile.value = file;
    coverImagePreview.value = URL.createObjectURL(file);
    removeCover.value = false;
  }
}

function removeImage() {
  coverImageFile.value = null;
  coverImagePreview.value = "";
  currentCoverImage.value = "";
  removeCover.value = true;
}

async function handleUpdateBook() {
  try {
    isLoading.value = true;
    const result = await booksStore.updateBook({
      id: book._id,
      title: title.value,
      author: author.value,
      ISBN: isbn.value,
      total: total.value,
      availableCount: availableCount.value,
      category: category.value,
      description: description.value,
      coverImage: coverImageFile.value
        ? coverImageFile.value
        : removeCover.value
          ? ""
          : currentCoverImage.value,
    });
    emit("close");
    showToast(
      "success",
      result.message === "The Book Updated Successfully"
        ? "کتاب با موفقیت ویرایش شد"
        : result.message,
    );
  } catch (error: any) {
    console.error(error);
    if (error instanceof TypeError && error.message.includes("fetch")) {
      showToast("error", "اتصال به اینترنت برقرار نیست");
    } else {
      showToast("error", "خطا در ویرایش کتاب");
    }
  } finally {
    isLoading.value = false;
  }
}
</script>

<template>
  <div
    v-if="isOpen"
    @click.self="emit('close')"
    class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
  >
    <div
      class="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
    >
      <div
        class="sticky top-0 bg-white border-b border-b-solid border-gray-200 px-6 py-4 flex items-center justify-between"
      >
        <h2 class="text-xl my-0 font-bold text-gray-900">ویرایش کتاب</h2>
        <button
          @click="emit('close')"
          class="p-6px hover:bg-gray-100 rounded-lg transition-colors border-none bg-transparent cursor-pointer"
        >
          <Close class="w-5 h-5 text-gray-600" />
        </button>
      </div>

      <form @submit.prevent="handleUpdateBook" class="p-6 space-y-4">
        <div class="flex flex-col w-full">
          <label class="text-sm font-medium text-gray-700 mb-2">
            تصویر کتاب
          </label>
          <div v-if="coverImagePreview" class="relative mb-2">
            <img
              :src="coverImagePreview"
              alt="پیش‌نمایش تصویر کتاب"
              class="w-full h-48 object-cover rounded-lg border border-solid border-gray-200"
            />
            <button
              type="button"
              @click="removeImage"
              class="absolute top-2 left-2 bg-white p-1 rounded-full shadow-md hover:bg-red-50 transition-colors border-none cursor-pointer"
            >
              <Close class="w-4 h-4 text-red-600" />
            </button>
          </div>
          <input
            v-if="!coverImagePreview"
            type="file"
            accept="image/*"
            @change="handleFileChange"
            class="px-4 py-2 border border-solid border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 file:ml-2 file:py-1 file:px-3 file:rounded-lg file:border-0 file:bg-blue-50 file:text-blue-700 file:font-medium file:cursor-pointer file:hover:bg-blue-100"
          />
          <p v-if="!coverImagePreview" class="text-xs text-gray-500 mt-1">
            اختیاری - حداکثر ۵ مگابایت
          </p>
        </div>

        <div class="flex flex-col w-full">
          <label class="text-sm font-medium text-gray-700 mb-2">
            نام کتاب
          </label>
          <input
            type="text"
            name="title"
            v-model="title"
            class="px-4 py-2 border border-solid border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="نام کتاب را وارد کنید"
          />
        </div>

        <div class="flex flex-col w-full">
          <label class="text-sm font-medium text-gray-700 mb-2">
            نویسنده
          </label>
          <input
            type="text"
            name="author"
            v-model="author"
            class="px-4 py-2 border border-solid border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="نام نویسنده را وارد کنید"
          />
        </div>

        <div class="flex flex-col w-full">
          <label class="text-sm font-medium text-gray-700 mb-2">
            دسته‌بندی
          </label>
          <select
            name="category"
            v-model="category"
            class="px-4 py-2 border border-solid border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option
              v-for="category in categories"
              :key="category.value"
              :value="category.value"
            >
              {{ category.title }}
            </option>
          </select>
        </div>

        <div class="flex flex-col w-full">
          <label class="text-sm font-medium text-gray-700 mb-2">
            شماره ISBN
          </label>
          <input
            type="text"
            name="isbn"
            v-model="isbn"
            class="px-4 py-2 border border-solid border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="مثال: 978-1234567890"
          />
        </div>

        <div class="flex items-center gap-4">
          <div class="flex flex-col w-full">
            <label class="text-sm font-medium text-gray-700 mb-2">
              تعداد کل نسخه‌ها
            </label>
            <input
              type="number"
              name="totalCopies"
              v-model="total"
              min="1"
              class="px-4 py-2 border border-solid border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div class="flex flex-col w-full">
            <label class="text-sm font-medium text-gray-700 mb-2">
              تعداد موجود
            </label>
            <input
              type="number"
              name="availableCopies"
              v-model="availableCount"
              min="0"
              :max="total"
              class="px-4 py-2 border border-solid border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div class="flex flex-col w-full">
          <label class="text-sm font-medium text-gray-700 mb-2">
            توضیحات
          </label>
          <textarea
            name="description"
            v-model="description"
            rows="{4}"
            class="px-4 py-2 border border-solid border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            placeholder="توضیحات کوتاه درباره کتاب..."
          />
        </div>

        <div class="flex items-center gap-3 pt-4">
          <button
            type="submit"
            class="flex-1 relative bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium cursor-pointer border-none"
            :class="{ 'opacity-70 cursor-not-allowed': isLoading }"
            :disabled="isLoading"
          >
            <span>ویرایش کتاب</span>
            <CircleLoading
              v-if="isLoading"
              class="absolute inset-0 mx-auto right-26 top-2 w-6 h-6"
            />
          </button>
          <button
            type="button"
            @click="emit('close')"
            class="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg hover:bg-gray-200 transition-colors font-medium cursor-pointer border-none"
          >
            انصراف
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
