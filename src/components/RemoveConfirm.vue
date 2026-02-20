<!-- components/ConfirmDialog.vue -->
<script setup lang="ts">
import { onUnmounted, Teleport, Transition } from "vue";
import RemoveBook from "./icons/RemoveBook.vue";
import CircleLoading from "./CircleLoading.vue";

const props = withDefaults(
  defineProps<{
    isOpen: boolean;
    isLoading: boolean;
    title?: string;
    message?: string;
    confirmText?: string;
    cancelText?: string;
    bookTitle?: string;
  }>(),
  {
    title: "تأیید حذف",
    message: "آیا از حذف این کتاب اطمینان دارید؟",
    confirmText: "حذف",
    cancelText: "انصراف",
    bookTitle: "",
  },
);

const emit = defineEmits<{
  (e: "confirm"): void;
  (e: "close"): void;
}>();

const handleConfirm = () => {
  emit("confirm");
  handleClose();
};

const handleClose = () => {
  emit("close");
};

const handleOverlayClick = (e: MouseEvent) => {
  if (e.target === e.currentTarget) {
    handleClose();
  }
};

const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === "Escape" && props.isOpen) {
    handleClose();
  }
};

if (typeof window !== "undefined") {
  window.addEventListener("keydown", handleKeydown);
}

onUnmounted(() => {
  window.removeEventListener("keydown", handleKeydown);
});
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="isOpen"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
        @click="handleOverlayClick"
      >
        <Transition
          enter-active-class="transition duration-200 ease-out"
          enter-from-class="scale-95 opacity-0"
          enter-to-class="scale-100 opacity-100"
          leave-active-class="transition duration-150 ease-in"
          leave-from-class="scale-100 opacity-100"
          leave-to-class="scale-95 opacity-0"
        >
          <div
            class="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden"
            dir="rtl"
          >
            <div
              class="flex items-center gap-3 px-4 py-2 border-b border-b-solid border-gray-100"
            >
              <div
                class="flex items-center justify-center shrink-0 w-10 h-10 rounded-full bg-red-100"
              >
                <RemoveBook class="w-5 h-5 text-red-600" />
              </div>
              <h3 class="text-xl font-semibold text-gray-900">
                {{ title }}
              </h3>
            </div>

            <div class="px-6 py-2">
              <p class="text-gray-600">
                {{ message }}
              </p>

              <p v-if="bookTitle" class="mt-2 text-sm text-gray-500">
                کتاب:
                <span class="font-medium text-gray-700">{{ bookTitle }}</span>
              </p>

              <p class="mt-4 text-sm text-red-600 bg-red-50 p-3 rounded-lg">
                <span class="font-medium">توجه:</span> این عملیات قابل بازگشت
                نیست.
              </p>
            </div>

            <div class="flex gap-3 p-4 bg-gray-50">
              <button
                type="button"
                class="flex-1 px-4 py-2.5 bg-white border border-solid border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors font-medium cursor-pointer"
                @click="handleClose"
              >
                {{ cancelText }}
              </button>
              <button
                type="button"
                class="flex-1 relative px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 border-none cursor-pointer"
                :class="{ 'opacity-70 cursor-not-allowed': isLoading }"
                @click="handleConfirm"
                :disabled="isLoading"
              >
                {{ confirmText }}
                <CircleLoading
                  v-if="isLoading"
                  class="absolute inset-0 mx-auto right-20 top-2 w-6 h-6"
                />
              </button>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>
