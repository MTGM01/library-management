<script setup lang="ts">
import BookOpen from "./icons/BookOpen.vue";
import LogOut from "./icons/LogOut.vue";
import Search from "./icons/Search.vue";
import UnknownUser from "./icons/UnknownUser.vue";

// import { Search, User, BookOpen, LogOut } from 'lucide-react';
// import { UserRole } from '../App';

// interface HeaderProps {
//   userRole: UserRole;
//   onSearch: (query: string) => void;
//   onRoleChange: (role: UserRole) => void;
// }

// export function Header({ userRole, onSearch, onRoleChange }: HeaderProps) {
//   return (
//   );
// }

const userRole = "user";
</script>

<template>
  <header
    class="bg-white shadow-sm border-b border-gray-200 w-full sticky top-0 z-50"
  >
    <div class="mx-auto px-6 py-4">
      <div class="flex items-center">
        <div class="flex items-center gap-4">
          <button
            class="p-2 hover:bg-red-50 rounded-lg bg-transparent outline-none border-none cursor-pointer transition-colors"
            title="خروج"
          >
            <LogOut class="w-5 h-5 text-gray-600 hover:text-red-600" />
          </button>

          <div class="flex items-center gap-3">
            <div
              class="bg-blue-100 flex items-center justify-center w-9 h-9 rounded-full"
            >
              <UnknownUser class="w-5 h-5 text-blue-600" />
            </div>
            <div class="text-left">
              <p class="text-sm font-medium text-gray-900">
                <!-- {userRole === 'admin' ? 'مدیر سیستم' : 'کاربر عادی'} -->
              </p>
              <p class="text-xs text-gray-500">user@example.com</p>
            </div>
            <div class="h-9 w-1px bg-gray-200" />
          </div>

          <div class="flex gap-2 bg-gray-100 p-1 rounded-lg">
            <button
              class="px-3 py-1.5 rounded text-sm transition-colors border-none outline-none bg-transparent"
              :class="
                userRole === 'user'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              "
            >
              <!-- onClick={() => onRoleChange('user')} -->
              کاربر
            </button>
            <button
              class="px-3 py-1.5 rounded text-sm transition-colors bg-transparent outline-none border-none"
              :class="
                userRole === 'admin'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              "
            >
              <!-- onClick={() => onRoleChange('admin')} -->
              مدیر
            </button>
          </div>
        </div>

        <div class="relative grow mx-8">
          <input
            dir="rtl"
            type="search"
            placeholder="جستجوی کتاب بر اساس نام ..."
            class="w-full px-4 py-3 pr-12 rounded-lg bg-transparent border border-solid border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <!-- onChange={(e) => onSearch(e.target.value)} -->
          <Search
            class="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
          />
        </div>

        <div class="flex items-center justify-end gap-3">
          <div class="flex flex-col">
            <h1 class="text-xl my-0 font-bold text-gray-900">
              سیستم مدیریت کتابخانه
            </h1>
            <span class="text-xs text-right text-gray-500">
              پنل کاربری
              <!-- {userRole === 'admin' ? 'پنل مدیریت' : 'پنل کاربری'} -->
            </span>
          </div>
          <div class="flex items-center bg-blue-600 p-2 rounded-lg">
            <BookOpen class="w-6 h-6 text-white" />
          </div>
        </div>
      </div>
    </div>
  </header>
</template>
