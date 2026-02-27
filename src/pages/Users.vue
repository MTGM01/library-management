<script setup lang="ts">
import { computed, ref, watchEffect } from "vue";
import Header from "../components/Header.vue";
import { User_GetProfile } from "../repository/keyval/userProfile";
import { User } from "../repository/user";
import Footer from "../components/Footer.vue";
import { useRouter } from "vue-router";
import UserPlus from "../components/icons/UserPlus.vue";
import UserCheck from "../components/icons/UserCheck.vue";
import UserCross from "../components/icons/UserCross.vue";
import AlertCircle from "../components/icons/AlertCircle.vue";
import Search from "../components/icons/Search.vue";
import Eye from "../components/icons/Eye.vue";
import UserManagement from "../components/icons/UserManagement.vue";

// import { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router';
// import { Users, Search, UserCheck, UserX, Eye, AlertCircle, UserPlus } from 'lucide-react';
// import { Footer } from './Footer';
// import { AddUserModal } from './AddUserModal';
// import { mockUsers, User } from '../data/mockData';
// import { UserRole } from '../App';

const router = useRouter();
const user = ref<User>(new User(User_GetProfile()));
const usersList = ref<User[]>([]);
const searchedUser = ref("");
const filteredUsers = computed(() => {
  if (!usersList.value) return null;
  if (!searchedUser.value.trim()) return usersList.value;
  return usersList.value.filter(
    (u) =>
      u.firstName.toLowerCase().includes(searchedUser.value.toLowerCase()) ||
      u.lastName.toLowerCase().includes(searchedUser.value.toLowerCase()),
  );
});
const activeUsersCount = computed(
  () => usersList.value.filter((u) => u.status === "ACTIVE").length,
);
const reservationsCount = computed(() =>
  usersList.value.reduce((sum, u) => sum + u.reservedBooks.length, 0),
);

watchEffect(async () => {
  const plainUsers = (await User.getUsers()).result.filter(
    (u) => u.role === "USER",
  );
  usersList.value = plainUsers.map((pu) => User.fromJSON(pu));
});
// export function UserManagement() {
//   const navigate = useNavigate();
//   const [searchQuery, setSearchQuery] = useState('');
//   const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'blocked'>('all');
//   const [users, setUsers] = useState<User[]>(mockUsers);
//   const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);

//   const [userRole, setUserRole] = useState<UserRole>(() => {
//     const savedRole = localStorage.getItem('userRole');
//     return (savedRole as UserRole) || 'user';
//   });

//   // بررسی دسترسی - فقط ادمین
//   useEffect(() => {
//     const userEmail = localStorage.getItem('userEmail');
//     const savedRole = localStorage.getItem('userRole');

//     if (!userEmail || savedRole !== 'admin') {
//       navigate('/library');
//     }
//   }, [navigate]);

//   const handleLogout = () => {
//     localStorage.removeItem('userRole');
//     localStorage.removeItem('userEmail');
//     navigate('/');
//   };

//   const handleRoleChange = (role: UserRole) => {
//     setUserRole(role);
//     localStorage.setItem('userRole', role || 'user');
//     if (role !== 'admin') {
//       navigate('/library');
//     }
//   };

//   const handleToggleUserStatus = (userId: string) => {
//     setUsers(users.map(user =>
//       user.id === userId
//         ? { ...user, status: user.status === 'active' ? 'blocked' : 'active' }
//         : user
//     ));
//   };

//   const handleAddUser = (newUser: Omit<User, 'id' | 'activeReservations'>) => {
//     const user: User = {
//       ...newUser,
//       id: Date.now().toString(),
//       activeReservations: 0
//     };
//     setUsers([...users, user]);
//     setIsAddUserModalOpen(false);
//   };

//   const handleViewUser = (userId: string) => {
//     navigate(`/users/${userId}`);
//   };

//   // فیلتر کردن کاربران
//   const filteredUsers = users.filter(user => {
//     const matchesSearch =
//       user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       user.phone.includes(searchQuery);

//     const matchesStatus = statusFilter === 'all' || user.status === statusFilter;

//     return matchesSearch && matchesStatus;
//   });

//   const stats = {
//     total: users.length,
//     active: users.filter(u => u.status === 'active').length,
//     blocked: users.filter(u => u.status === 'blocked').length,
//     totalReservations: users.reduce((sum, u) => sum + u.activeReservations, 0)
//   };
</script>

<template>
  <div class="min-h-screen flex flex-col bg-gray-50" dir="rtl">
    <Header dir="ltr" :user :no-search="true" @changeRole="router.back()" />

    <section class="flex-1 p-6">
      <div class="max-w-7xl mx-auto">
        <div class="mb-8">
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center gap-3">
              <div class="bg-blue-600 p-3 rounded-xl">
                <UserManagement class="w-7 h-7 text-white" />
              </div>
              <div class="flex flex-col gap-2">
                <h1 class="text-3xl font-bold text-gray-900 my-0">
                  مدیریت کاربران
                </h1>
                <p class="text-gray-600 my-0">
                  مدیریت و نظارت بر کاربران سیستم
                </p>
              </div>
            </div>

            <div class="flex gap-3">
              <button
                class="px-6 py-3 bg-white border border-solid border-gray-300 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                @click="router.back()"
              >
                بازگشت به کتابخانه
              </button>

              <button
                class="px-6 py-3 border-none bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 cursor-pointer"
              >
                <!-- onClick={() => setIsAddUserModalOpen(true)} -->
                <UserPlus class="w-5 h-5" />
                <span>افزودن کاربر جدید</span>
              </button>
            </div>
          </div>

          <div class="grid grid-cols-4 gap-4">
            <div
              class="bg-white p-6 rounded-xl border border-solid border-gray-200"
            >
              <div class="flex items-center justify-between">
                <div class="flex flex-col">
                  <span class="text-gray-600 text-sm mb-1">کل کاربران</span>
                  <span class="text-3xl font-bold text-gray-900">
                    {{ usersList.length }}
                  </span>
                </div>
                <UserManagement class="w-10 h-10 text-blue-600" />
              </div>
            </div>

            <div
              class="bg-white p-6 rounded-xl border border-solid border-gray-200"
            >
              <div class="flex items-center justify-between">
                <div class="flex flex-col">
                  <span class="text-gray-600 text-sm mb-1">کاربران فعال</span>
                  <span class="text-3xl font-bold text-green-600">
                    {{ activeUsersCount }}
                  </span>
                </div>
                <UserCheck class="w-10 h-10 text-green-600" />
              </div>
            </div>

            <div
              class="bg-white p-6 rounded-xl border border-solid border-gray-200"
            >
              <div class="flex items-center justify-between">
                <div class="flex flex-col">
                  <span class="text-gray-600 text-sm mb-1">کاربران مسدود</span>
                  <span class="text-3xl font-bold text-red-600">
                    {{ usersList.length - activeUsersCount }}
                  </span>
                </div>
                <UserCross class="w-10 h-10 text-red-600" />
              </div>
            </div>

            <div
              class="bg-white p-6 rounded-xl border border-solid border-gray-200"
            >
              <div class="flex items-center justify-between">
                <div class="flex flex-col">
                  <span class="text-gray-600 text-sm mb-1">رزروهای فعال</span>
                  <span class="text-3xl font-bold text-orange-600">
                    {{ reservationsCount }}
                  </span>
                </div>
                <AlertCircle class="w-10 h-10 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        <div
          class="bg-white rounded-xl border border-solid border-gray-200 p-6 mb-6"
        >
          <div class="flex items-center gap-4">
            <div class="flex-1 relative">
              <input
                type="search"
                placeholder="جستجو بر اساس نام ..."
                v-model="searchedUser"
                class="w-93% px-4 py-3 pr-12 rounded-lg border border-solid border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <Search
                class="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
              />
            </div>

            <div class="flex gap-2 bg-gray-100 p-1 rounded-lg">
              <button>
                <!-- class={`px-4 py-2 rounded text-sm transition-colors ${
                  statusFilter === 'all'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
                }`} -->
                <!-- onClick={() => setStatusFilter('all')} -->
                همه
              </button>
              <button>
                <!-- class={`px-4 py-2 rounded text-sm transition-colors ${
                  statusFilter === 'active'
                  ? 'bg-white text-green-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
                }`} -->
                <!-- onClick={() => setStatusFilter('active')} -->
                فعال
              </button>
              <button>
                <!-- class={`px-4 py-2 rounded text-sm transition-colors ${
                  statusFilter === 'blocked'
                  ? 'bg-white text-red-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
                }`} -->
                <!-- onClick={() => setStatusFilter('blocked')} -->
                مسدود شده
              </button>
            </div>
          </div>
        </div>

        <div
          class="bg-white rounded-xl border border-solid border-gray-200 overflow-hidden"
        >
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead class="bg-gray-50 border-b border-b-solid border-gray-200">
                <tr>
                  <th
                    class="px-6 py-4 text-right text-sm font-bold text-gray-900"
                  >
                    نام کاربر
                  </th>
                  <th
                    class="px-6 py-4 text-right text-sm font-bold text-gray-900"
                  >
                    شماره تماس
                  </th>
                  <th
                    class="px-6 py-4 text-right text-sm font-bold text-gray-900"
                  >
                    تاریخ عضویت
                  </th>
                  <th
                    class="px-6 py-4 text-right text-sm font-bold text-gray-900"
                  >
                    رزروهای فعال
                  </th>
                  <th
                    class="px-6 py-4 text-right text-sm font-bold text-gray-900"
                  >
                    وضعیت
                  </th>
                  <th
                    class="px-6 py-4 text-right text-sm font-bold text-gray-900"
                  >
                    عملیات
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200">
                <tr
                  v-for="filteredUser in filteredUsers"
                  :key="filteredUser.id"
                  class="hover:bg-gray-50 transition-colors"
                >
                  <td class="px-6 py-4">
                    <div class="flex items-center gap-3">
                      <div
                        class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center"
                      >
                        <span class="text-blue-600 font-bold">
                          {{ filteredUser.firstName.charAt(0) }}
                        </span>
                      </div>
                      <span class="font-medium text-gray-900">
                        {{ filteredUser.firstName }} {{ filteredUser.lastName }}
                      </span>
                    </div>
                  </td>
                  <td class="px-6 py-4 text-gray-600">
                    {{ filteredUser.mobile }}
                  </td>
                  <td class="px-6 py-4 text-gray-600">
                    {{
                      new Date(filteredUser.createdAt).toLocaleDateString(
                        "fa-IR",
                      )
                    }}
                  </td>
                  <td class="px-6 py-4">
                    <span
                      class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium"
                      :class="
                        filteredUser.reservedBooks.length > 0
                          ? 'bg-orange-100 text-orange-700'
                          : 'bg-gray-100 text-gray-600'
                      "
                    >
                      {{ filteredUser.reservedBooks.length }} کتاب
                    </span>
                  </td>
                  <td class="px-6 py-4">
                    <span
                      class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium"
                      :class="
                        filteredUser.status === 'ACTIVE'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      "
                    >
                      {{ filteredUser.status === "ACTIVE" ? "فعال" : "مسدود" }}
                    </span>
                  </td>
                  <td class="px-6 py-4">
                    <div class="flex items-center gap-2">
                      <button
                        type="button"
                        class="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border-none bg-transparent cursor-pointer"
                        title="مشاهده جزئیات"
                      >
                        <!-- onClick={() => handleViewUser(user.id)} -->
                        <Eye class="w-5 h-5" />
                      </button>
                      <button
                        type="button"
                        class="p-2 rounded-lg transition-colors bg-transparent border-none cursor-pointer"
                        :class="
                          filteredUser.status === 'ACTIVE'
                            ? ' text-green-600 hover:bg-green-50'
                            : 'text-red-600 hover:bg-red-50'
                        "
                        :title="
                          filteredUser.status === 'ACTIVE'
                            ? 'فعال کردن'
                            : 'مسدود کردن'
                        "
                      >
                        <!-- onClick={() => handleToggleUserStatus(user.id)} -->
                        <UserCheck
                          v-if="filteredUser.status === 'ACTIVE'"
                          class="w-5 h-5"
                        />
                        <UserCross v-else class="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div v-if="!filteredUsers?.length" class="text-center py-12">
            <UserManagement class="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p class="text-gray-500">کاربری یافت نشد</p>
          </div>
        </div>
      </div>
    </section>

    <Footer dir="ltr" />

    <!-- {isAddUserModalOpen && (
        <AddUserModal
          onClose={() => setIsAddUserModalOpen(false)}
          onAdd={handleAddUser}
        />
      )} -->
  </div>
</template>
