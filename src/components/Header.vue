<script setup lang="ts">
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
</script>

<template>
  <header
    className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50"
  >
    <div className="max-w-7xl mx-auto px-6 py-4">
      <div className="flex items-center justify-between gap-8">
        {/* لوگو */}
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-lg">
            <BookOpen className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">
              سیستم مدیریت کتابخانه
            </h1>
            <p className="text-xs text-gray-500">
              <!-- {userRole === 'admin' ? 'پنل مدیریت' : 'پنل کاربری'} -->
            </p>
          </div>
        </div>

        <!-- {/* جستجو */} -->
        <div className="flex-1 max-w-2xl">
          <div className="relative">
            <input
              type="text"
              placeholder="جستجوی کتاب بر اساس نام یا نویسنده..."
              className="w-full px-4 py-3 pr-12 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <!-- onChange={(e) => onSearch(e.target.value)} -->
            <Search
              className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
            />
          </div>
        </div>

        <!-- {/* منوی کاربر */} -->
        <div className="flex items-center gap-4">
          <!-- {/* تغییر نقش (فقط برای نمایش demo) */} -->
          <div className="flex gap-2 bg-gray-100 p-1 rounded-lg">
            <button>
              <!-- className={`px-3 py-1.5 rounded text-sm transition-colors ${
                userRole === 'user' 
                ? 'bg-white text-blue-600 shadow-sm' 
                : 'text-gray-600 hover:text-gray-900'
              }`} -->
              <!-- onClick={() => onRoleChange('user')} -->
              کاربر
            </button>
            <button>
              <!-- onClick={() => onRoleChange('admin')}
              className={`px-3 py-1.5 rounded text-sm transition-colors ${
                userRole === 'admin' 
                  ? 'bg-white text-blue-600 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`} -->
              مدیر
            </button>
          </div>

          <!-- {/* پروفایل کاربر */} -->
          <div
            className="flex items-center gap-3 border-r border-gray-200 pr-4"
          >
            <div className="text-left">
              <p className="text-sm font-medium text-gray-900">
                <!-- {userRole === 'admin' ? 'مدیر سیستم' : 'کاربر عادی'} -->
              </p>
              <p className="text-xs text-gray-500">user@example.com</p>
            </div>
            <div className="bg-blue-100 p-2 rounded-full">
              <User className="w-5 h-5 text-blue-600" />
            </div>
          </div>

          {/* دکمه خروج */}
          <button
            className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="خروج"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  </header>
</template>
