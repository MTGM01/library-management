<script setup lang="ts">
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Users, Search, UserCheck, UserX, Eye, AlertCircle, UserPlus } from 'lucide-react';
import { Header } from './Header';
import { Footer } from './Footer';
import { AddUserModal } from './AddUserModal';
import { mockUsers, User } from '../data/mockData';
import { UserRole } from '../App';

export function UserManagement() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'blocked'>('all');
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);

  const [userRole, setUserRole] = useState<UserRole>(() => {
    const savedRole = localStorage.getItem('userRole');
    return (savedRole as UserRole) || 'user';
  });

  // بررسی دسترسی - فقط ادمین
  useEffect(() => {
    const userEmail = localStorage.getItem('userEmail');
    const savedRole = localStorage.getItem('userRole');
    
    if (!userEmail || savedRole !== 'admin') {
      navigate('/library');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('userRole');
    localStorage.removeItem('userEmail');
    navigate('/');
  };

  const handleRoleChange = (role: UserRole) => {
    setUserRole(role);
    localStorage.setItem('userRole', role || 'user');
    if (role !== 'admin') {
      navigate('/library');
    }
  };

  const handleToggleUserStatus = (userId: string) => {
    setUsers(users.map(user => 
      user.id === userId 
        ? { ...user, status: user.status === 'active' ? 'blocked' : 'active' }
        : user
    ));
  };

  const handleAddUser = (newUser: Omit<User, 'id' | 'activeReservations'>) => {
    const user: User = {
      ...newUser,
      id: Date.now().toString(),
      activeReservations: 0
    };
    setUsers([...users, user]);
    setIsAddUserModalOpen(false);
  };

  const handleViewUser = (userId: string) => {
    navigate(`/users/${userId}`);
  };

  // فیلتر کردن کاربران
  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.phone.includes(searchQuery);
    
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: users.length,
    active: users.filter(u => u.status === 'active').length,
    blocked: users.filter(u => u.status === 'blocked').length,
    totalReservations: users.reduce((sum, u) => sum + u.activeReservations, 0)
  };
</script>

<template>

    <div className="min-h-screen flex flex-col bg-gray-50" dir="rtl">
      <Header 
        userRole={userRole}
        onSearch={() => {}}
        onRoleChange={handleRoleChange}
        onLogout={handleLogout}
      />

      <main className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">
          {/* هدر صفحه */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="bg-blue-600 p-3 rounded-xl">
                  <Users className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">مدیریت کاربران</h1>
                  <p className="text-gray-600">مدیریت و نظارت بر کاربران سیستم</p>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => navigate('/library')}
                  className="px-6 py-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  بازگشت به کتابخانه
                </button>

                <button
                  onClick={() => setIsAddUserModalOpen(true)}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  <UserPlus className="w-5 h-5" />
                  <span>افزودن کاربر جدید</span>
                </button>
              </div>
            </div>

            {/* آمار کلی */}
            <div className="grid grid-cols-4 gap-4">
              <div className="bg-white p-6 rounded-xl border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm mb-1">کل کاربران</p>
                    <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
                  </div>
                  <Users className="w-10 h-10 text-blue-600" />
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm mb-1">کاربران فعال</p>
                    <p className="text-3xl font-bold text-green-600">{stats.active}</p>
                  </div>
                  <UserCheck className="w-10 h-10 text-green-600" />
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm mb-1">کاربران مسدود</p>
                    <p className="text-3xl font-bold text-red-600">{stats.blocked}</p>
                  </div>
                  <UserX className="w-10 h-10 text-red-600" />
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm mb-1">رزروهای فعال</p>
                    <p className="text-3xl font-bold text-orange-600">{stats.totalReservations}</p>
                  </div>
                  <AlertCircle className="w-10 h-10 text-orange-600" />
                </div>
              </div>
            </div>
          </div>

          {/* فیلترها و جستجو */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
            <div className="flex gap-4 items-center">
              {/* جستجو */}
              <div className="flex-1 relative">
                <input
                  type="text"
                  placeholder="جستجو بر اساس نام، ایمیل یا شماره تماس..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-3 pr-12 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>

              {/* فیلتر وضعیت */}
              <div className="flex gap-2 bg-gray-100 p-1 rounded-lg">
                <button
                  onClick={() => setStatusFilter('all')}
                  className={`px-4 py-2 rounded text-sm transition-colors ${
                    statusFilter === 'all'
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  همه
                </button>
                <button
                  onClick={() => setStatusFilter('active')}
                  className={`px-4 py-2 rounded text-sm transition-colors ${
                    statusFilter === 'active'
                      ? 'bg-white text-green-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  فعال
                </button>
                <button
                  onClick={() => setStatusFilter('blocked')}
                  className={`px-4 py-2 rounded text-sm transition-colors ${
                    statusFilter === 'blocked'
                      ? 'bg-white text-red-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  مسدود شده
                </button>
              </div>
            </div>
          </div>

          {/* جدول کاربران */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-right text-sm font-bold text-gray-900">نام کاربر</th>
                    <th className="px-6 py-4 text-right text-sm font-bold text-gray-900">ایمیل</th>
                    <th className="px-6 py-4 text-right text-sm font-bold text-gray-900">شماره تماس</th>
                    <th className="px-6 py-4 text-right text-sm font-bold text-gray-900">تاریخ عضویت</th>
                    <th className="px-6 py-4 text-right text-sm font-bold text-gray-900">رزروهای فعال</th>
                    <th className="px-6 py-4 text-right text-sm font-bold text-gray-900">وضعیت</th>
                    <th className="px-6 py-4 text-right text-sm font-bold text-gray-900">عملیات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-blue-600 font-bold">
                              {user.name.charAt(0)}
                            </span>
                          </div>
                          <span className="font-medium text-gray-900">{user.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-600">{user.email}</td>
                      <td className="px-6 py-4 text-gray-600" dir="ltr">{user.phone}</td>
                      <td className="px-6 py-4 text-gray-600">{user.joinDate}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                          user.activeReservations > 0
                            ? 'bg-orange-100 text-orange-700'
                            : 'bg-gray-100 text-gray-600'
                        }`}>
                          {user.activeReservations} کتاب
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                          user.status === 'active'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                        }`}>
                          {user.status === 'active' ? 'فعال' : 'مسدود'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleViewUser(user.id)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="مشاهده جزئیات"
                          >
                            <Eye className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleToggleUserStatus(user.id)}
                            className={`p-2 rounded-lg transition-colors ${
                              user.status === 'active'
                                ? 'text-red-600 hover:bg-red-50'
                                : 'text-green-600 hover:bg-green-50'
                            }`}
                            title={user.status === 'active' ? 'مسدود کردن' : 'فعال کردن'}
                          >
                            {user.status === 'active' ? (
                              <UserX className="w-5 h-5" />
                            ) : (
                              <UserCheck className="w-5 h-5" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredUsers.length === 0 && (
              <div className="text-center py-12">
                <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">کاربری یافت نشد</p>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />

      {/* Modal افزودن کاربر */}
      {isAddUserModalOpen && (
        <AddUserModal
          onClose={() => setIsAddUserModalOpen(false)}
          onAdd={handleAddUser}
        />
      )}
    </div>
</template>
