<script setup lang="ts">
import { computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import Header from "../components/Header.vue";
import Footer from "../components/Footer.vue";
import UnknownUser from "../components/icons/UnknownUser.vue";
import Calendar from "../components/icons/Calendar.vue";
import BookOpen from "../components/icons/BookOpen.vue";
import phone from "../components/icons/phone.vue";
import { convertISOToJalali } from "../utils/convertDate";
import { useAuthStore } from "../repository/authStore";
import { useUsersStore } from "../repository/usersStore";

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const usersStore = useUsersStore();
const { profile, role, mobile } = storeToRefs(authStore);
const { users } = storeToRefs(usersStore);

const selectedUser = computed(() =>
  users.value.find((user) => user.id === route.params.userId),
);

onMounted(() => {
  usersStore.fetchUsers();
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
      @change-role="router.back()"
    />

    <main class="flex-1 p-6">
      <div class="max-w-4xl mx-auto">
        <button
          type="button"
          class="flex items-center gap-2 bg-transparent border-none text-gray-600 hover:text-gray-900 mb-6 transition-colors cursor-pointer"
          @click="router.push('/users')"
        >
          <span>بازگشت به لیست کاربران</span>
        </button>

        <section
          v-if="selectedUser"
          class="bg-white rounded-xl border border-solid border-gray-200 p-6"
        >
          <div class="flex items-start justify-between gap-6">
            <div class="flex items-center gap-4">
              <div
                class="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center"
              >
                <UnknownUser class="w-10 h-10 text-blue-600" />
              </div>

              <div class="flex flex-col gap-3">
                <h1 class="text-2xl font-bold text-gray-900 my-0">
                  {{ selectedUser.firstName }} {{ selectedUser.lastName }}
                </h1>
                <div class="flex flex-col gap-2 text-sm text-gray-600">
                  <div class="flex items-center gap-2">
                    <phone class="w-4 h-4" />
                    <span dir="ltr">{{ selectedUser.mobile }}</span>
                  </div>
                  <div class="flex items-center gap-2">
                    <Calendar class="w-4 h-4" />
                    <span>
                      عضویت از {{ convertISOToJalali(selectedUser.createdAt) }}
                    </span>
                  </div>
                  <div class="flex items-center gap-2">
                    <BookOpen class="w-4 h-4" />
                    <span>{{ selectedUser.reservedBooks.length }} کتاب رزرو شده</span>
                  </div>
                </div>
              </div>
            </div>

            <span
              class="px-4 py-2 rounded-full text-sm font-medium"
              :class="
                selectedUser.status === 'ACTIVE'
                  ? 'bg-green-100 text-green-700'
                  : 'bg-red-100 text-red-700'
              "
            >
              {{ selectedUser.status === "ACTIVE" ? "فعال" : "مسدود" }}
            </span>
          </div>
        </section>

        <section
          v-else
          class="bg-white rounded-xl border border-solid border-gray-200 p-12 text-center"
        >
          <UnknownUser class="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h1 class="text-2xl font-bold text-gray-900 mb-4">کاربر یافت نشد</h1>
          <button
            type="button"
            class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors border-none cursor-pointer"
            @click="router.push('/users')"
          >
            بازگشت به لیست کاربران
          </button>
        </section>
      </div>
    </main>

    <Footer dir="ltr" />
  </div>
</template>
