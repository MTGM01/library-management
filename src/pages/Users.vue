<script setup lang="ts">
import { ref } from "vue";
import Header from "../components/Header.vue";
import { User_GetProfile } from "../repository/keyval/userProfile";
import { User } from "../repository/user";
import Footer from "../components/Footer.vue";
import UserManagement from "../components/icons/UserManagement.vue";
import { useRouter } from "vue-router";
import UserPlus from "../components/icons/UserPlus.vue";

// import { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router';
// import { Users, Search, UserCheck, UserX, Eye, AlertCircle, UserPlus } from 'lucide-react';
// import { Footer } from './Footer';
// import { AddUserModal } from './AddUserModal';
// import { mockUsers, User } from '../data/mockData';
// import { UserRole } from '../App';

const router = useRouter();
const user = ref<User>(new User(User_GetProfile()));

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
            <div class="bg-white p-6 rounded-xl border border-gray-200">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-gray-600 text-sm mb-1">کل کاربران</p>
                  <p class="text-3xl font-bold text-gray-900">{stats.total}</p>
                </div>
                <!-- <Users class="w-10 h-10 text-blue-600" /> -->
              </div>
            </div>

            <div class="bg-white p-6 rounded-xl border border-gray-200">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-gray-600 text-sm mb-1">کاربران فعال</p>
                  <p class="text-3xl font-bold text-green-600">
                    {stats.active}
                  </p>
                </div>
                <UserCheck class="w-10 h-10 text-green-600" />
              </div>
            </div>

            <div class="bg-white p-6 rounded-xl border border-gray-200">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-gray-600 text-sm mb-1">کاربران مسدود</p>
                  <p class="text-3xl font-bold text-red-600">{stats.blocked}</p>
                </div>
                <UserX class="w-10 h-10 text-red-600" />
              </div>
            </div>

            <div class="bg-white p-6 rounded-xl border border-gray-200">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-gray-600 text-sm mb-1">رزروهای فعال</p>
                  <p class="text-3xl font-bold text-orange-600">
                    {stats.totalReservations}
                  </p>
                </div>
                <AlertCircle class="w-10 h-10 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* فیلترها و جستجو */}
        <div class="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <div class="flex gap-4 items-center">
            {/* جستجو */}
            <div class="flex-1 relative">
              <input
                type="text"
                placeholder="جستجو بر اساس نام، ایمیل یا شماره تماس..."
                value="{searchQuery}"
                class="w-full px-4 py-3 pr-12 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <!-- onChange={(e) => setSearchQuery(e.target.value)} -->
              <Search
                class="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
              />
            </div>

            {/* فیلتر وضعیت */}
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

        {/* جدول کاربران */}
        <div class="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead class="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th
                    class="px-6 py-4 text-right text-sm font-bold text-gray-900"
                  >
                    نام کاربر
                  </th>
                  <th
                    class="px-6 py-4 text-right text-sm font-bold text-gray-900"
                  >
                    ایمیل
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
                <!-- {filteredUsers.map((user) => ( -->
                <tr key="{user.id}" class="hover:bg-gray-50 transition-colors">
                  <td class="px-6 py-4">
                    <div class="flex items-center gap-3">
                      <div
                        class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center"
                      >
                        <span class="text-blue-600 font-bold">
                          {user.name.charAt(0)}
                        </span>
                      </div>
                      <span class="font-medium text-gray-900">{user.name}</span>
                    </div>
                  </td>
                  <td class="px-6 py-4 text-gray-600">{user.email}</td>
                  <td class="px-6 py-4 text-gray-600" dir="ltr">
                    {user.phone}
                  </td>
                  <td class="px-6 py-4 text-gray-600">{user.joinDate}</td>
                  <td class="px-6 py-4">
                    <span>
                      <!-- class={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                          user.activeReservations > 0
                            ? 'bg-orange-100 text-orange-700'
                            : 'bg-gray-100 text-gray-600'
                        }`} -->
                      {user.activeReservations} کتاب
                    </span>
                  </td>
                  <td class="px-6 py-4">
                    <span>
                      <!-- class={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                          user.status === 'active'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                        }`} -->
                      {user.status === 'active' ? 'فعال' : 'مسدود'}
                    </span>
                  </td>
                  <td class="px-6 py-4">
                    <div class="flex items-center gap-2">
                      <button
                        class="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="مشاهده جزئیات"
                      >
                        <!-- onClick={() => handleViewUser(user.id)} -->
                        <Eye class="w-5 h-5" />
                      </button>
                      <button>
                        <!-- :title={user.status === 'active' ? 'مسدود کردن' : 'فعال کردن'} -->
                        <!-- onClick={() => handleToggleUserStatus(user.id)}
                          class={`p-2 rounded-lg transition-colors ${
                            user.status === 'active'
                              ? 'text-red-600 hover:bg-red-50'
                              : 'text-green-600 hover:bg-green-50'
                          }`} -->
                        {user.status === 'active' ? (
                        <UserX class="w-5 h-5" />
                        ) : (
                        <UserCheck class="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
                <!-- ))} -->
              </tbody>
            </table>
          </div>

          <!-- {filteredUsers.length === 0 && ( -->
          <div class="text-center py-12">
            <!-- <Users class="w-16 h-16 text-gray-300 mx-auto mb-4" /> -->
            <p class="text-gray-500">کاربری یافت نشد</p>
          </div>
          <!-- )} -->
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
