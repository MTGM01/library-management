<!-- <script setup lang="ts">
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { BookOpen, CheckCircle, Clock, AlertTriangle, ArrowRight } from 'lucide-react';
import { mockReservations, Reservation } from '../data/mockData';
import { UserRole } from '../App';
import { getActualReservationStatus, calculateOverdueDays, calculateLateFee, formatCurrency } from '../utils/dateHelpers';

export function MyReservations() {
  const navigate = useNavigate();
  
  const [currentUser, setCurrentUser] = useState(() => {
    const savedUser = localStorage.getItem('currentUser');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [userRole, setUserRole] = useState<UserRole>(() => {
    const savedRole = localStorage.getItem('userRole');
    return (savedRole as UserRole) || 'user';
  });

  // دریافت رزروهای کاربر فعلی
  const [reservations, setReservations] = useState<Reservation[]>(() => {
    const savedReservations = JSON.parse(localStorage.getItem('reservations') || '[]');
    const allReservations = [...mockReservations, ...savedReservations];
    return allReservations.filter(r => r.userId === currentUser?.id);
  });

  // محاسبه وضعیت واقعی
  const actualReservations = reservations.map(r => ({
    ...r,
    actualStatus: getActualReservationStatus(r.status, r.dueDate)
  }));

  // بررسی authentication
  useEffect(() => {
    const userEmail = localStorage.getItem('userEmail');
    if (!userEmail || !currentUser) {
      navigate('/');
    }
  }, [navigate, currentUser]);

  const handleLogout = () => {
    localStorage.removeItem('userRole');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('currentUser');
    navigate('/');
  };

  const handleRoleChange = (role: UserRole) => {
    setUserRole(role);
    localStorage.setItem('userRole', role || 'user');
    
    if (currentUser) {
      const updatedUser = { ...currentUser, role: role || 'user' };
      setCurrentUser(updatedUser);
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    }
  };

  const getStatusIcon = (status: Reservation['status']) => {
    switch (status) {
      case 'borrowed':
        return <BookOpen class="w-5 h-5 text-blue-600" />;
      case 'returned':
        return <CheckCircle class="w-5 h-5 text-green-600" />;
      case 'overdue':
        return <AlertTriangle class="w-5 h-5 text-red-600" />;
    }
  };

  const getStatusText = (status: Reservation['status']) => {
    switch (status) {
      case 'borrowed':
        return 'امانت گرفته شده';
      case 'returned':
        return 'بازگشت داده شده';
      case 'overdue':
        return 'دیرکرد';
    }
  };

  const getStatusColor = (status: Reservation['status']) => {
    switch (status) {
      case 'borrowed':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'returned':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'overdue':
        return 'bg-red-100 text-red-700 border-red-200';
    }
  };

  const activeReservations = actualReservations.filter(r => r.actualStatus === 'borrowed');
  const returnedReservations = actualReservations.filter(r => r.actualStatus === 'returned');
  const overdueReservations = actualReservations.filter(r => r.actualStatus === 'overdue');
  
  // محاسبه کل جریمه
  const totalLateFee = overdueReservations.reduce((sum, r) => {
    return sum + calculateLateFee(calculateOverdueDays(r.dueDate));
  }, 0);
</script>

<template>
  <div class="min-h-screen flex flex-col bg-gray-50" dir="rtl">
      <section class="flex-1 p-6">
        <div class="max-w-7xl mx-auto">
          {/* دکمه بازگشت */}
          <button
            onClick={() => navigate('/library')}
            class="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
          >
            <ArrowRight class="w-5 h-5" />
            <span>بازگشت به کتابخانه</span>
          </button>

          {/* هدر صفحه */}
          <div class="mb-8">
            <div class="flex items-center gap-3 mb-6">
              <div class="bg-blue-600 p-3 rounded-xl">
                <BookOpen class="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 class="text-3xl font-bold text-gray-900">رزروهای من</h1>
                <p class="text-gray-600">مشاهده و مدیریت کتاب‌های رزرو شده</p>
              </div>
            </div>

            {/* آمار رزروها */}
            <div class="grid grid-cols-4 gap-4">
              <div class="bg-white p-6 rounded-xl border border-gray-200">
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-gray-600 text-sm mb-1">کل رزروها</p>
                    <p class="text-3xl font-bold text-gray-900">{actualReservations.length}</p>
                  </div>
                  <BookOpen class="w-10 h-10 text-gray-400" />
                </div>
              </div>

              <div class="bg-white p-6 rounded-xl border border-gray-200">
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-gray-600 text-sm mb-1">در دست من</p>
                    <p class="text-3xl font-bold text-blue-600">{activeReservations.length}</p>
                  </div>
                  <Clock class="w-10 h-10 text-blue-600" />
                </div>
              </div>

              <div class="bg-white p-6 rounded-xl border border-gray-200">
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-gray-600 text-sm mb-1">بازگشت داده شده</p>
                    <p class="text-3xl font-bold text-green-600">{returnedReservations.length}</p>
                  </div>
                  <CheckCircle class="w-10 h-10 text-green-600" />
                </div>
              </div>

              <div class={`p-6 rounded-xl border-2 ${totalLateFee > 0 ? 'bg-red-50 border-red-300' : 'bg-white border-gray-200'}`}>
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-gray-600 text-sm mb-1">جریمه دیرکرد</p>
                    <p class={`text-2xl font-bold ${totalLateFee > 0 ? 'text-red-600' : 'text-gray-900'}`}>
                      {formatCurrency(totalLateFee)}
                    </p>
                  </div>
                  <AlertTriangle class={`w-10 h-10 ${totalLateFee > 0 ? 'text-red-600' : 'text-gray-400'}`} />
                </div>
              </div>
            </div>
          </div>

          {/* هشدار دیرکرد */}
          {overdueReservations.length > 0 && (
            <div class="bg-red-50 border-2 border-red-300 rounded-xl p-6 mb-6">
              <div class="flex items-start gap-4">
                <AlertTriangle class="w-8 h-8 text-red-600 flex-shrink-0 mt-1" />
                <div class="flex-1">
                  <h3 class="text-xl font-bold text-red-900 mb-3">
                    ⚠️ هشدار: شما {overdueReservations.length} کتاب دیرکرد دارید!
                  </h3>
                  <p class="text-red-700 mb-4 text-lg">
                    جمع جریمه دیرکرد: <strong class="text-2xl">{formatCurrency(totalLateFee)}</strong>
                  </p>
                  <div class="bg-white border border-red-300 rounded-lg p-4">
                    <p class="text-sm text-red-800 mb-2">
                      <strong>لطفاً هرچه سریعتر اقدام کنید:</strong>
                    </p>
                    <ul class="text-sm text-red-700 space-y-1 list-disc list-inside">
                      <li>کتاب‌های دیرکرد را به کتابخانه بازگردانید</li>
                      <li>جریمه دیرکرد را هنگام بازگشت کتاب پرداخت کنید</li>
                      <li>نرخ جریمه: 5,000 تومان به ازای هر روز تاخیر</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* لیست رزروها */}
          <div class="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div class="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <h2 class="text-xl font-bold text-gray-900">تاریخچه رزروها</h2>
            </div>

            <div class="divide-y divide-gray-200">
              {reservations.length === 0 ? (
                <div class="text-center py-16">
                  <BookOpen class="w-20 h-20 text-gray-300 mx-auto mb-4" />
                  <h3 class="text-xl font-bold text-gray-700 mb-2">هنوز کتابی رزرو نکرده‌اید</h3>
                  <p class="text-gray-500 mb-6">برای رزرو کتاب، به کتابخانه بروید و کتاب مورد نظر را انتخاب کنید</p>
                  <button
                    onClick={() => navigate('/library')}
                    class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    مشاهده کتابخانه
                  </button>
                </div>
              ) : (
                actualReservations.map((reservation) => {
                  const overdueDays = reservation.actualStatus === 'overdue' 
                    ? calculateOverdueDays(reservation.dueDate) 
                    : 0;
                  const lateFee = overdueDays > 0 ? calculateLateFee(overdueDays) : 0;
                  
                  return (
                    <div key={reservation.id} class="p-6 hover:bg-gray-50 transition-colors">
                      <div class="flex items-center gap-4">
                        {/* تصویر کتاب */}
                        <div class="w-20 h-28 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center shadow-md">
                          <BookOpen class="w-10 h-10 text-blue-600" />
                        </div>

                        {/* اطلاعات کتاب */}
                        <div class="flex-1">
                          <h3 class="text-xl font-bold text-gray-900 mb-2">{reservation.bookTitle}</h3>
                          <p class="text-sm text-gray-600 mb-3">نویسنده: {reservation.bookAuthor}</p>
                          
                          <div class="flex items-center gap-6 text-sm">
                            <div class="flex items-center gap-2 text-gray-600">
                              <Clock class="w-4 h-4" />
                              <span>تاریخ امانت: <strong>{reservation.reservationDate}</strong></span>
                            </div>
                            <div class={`flex items-center gap-2 ${reservation.actualStatus === 'overdue' ? 'text-red-600 font-bold' : 'text-gray-600'}`}>
                              <AlertTriangle class="w-4 h-4" />
                              <span>مهلت بازگشت: <strong>{reservation.dueDate}</strong></span>
                            </div>
                            {reservation.returnDate && (
                              <div class="flex items-center gap-2 text-gray-600">
                                <CheckCircle class="w-4 h-4" />
                                <span>تاریخ بازگشت: <strong>{reservation.returnDate}</strong></span>
                              </div>
                            )}
                          </div>
                          
                          {/* نمایش جریمه دیرکرد */}
                          {reservation.actualStatus === 'overdue' && (
                            <div class="mt-4 bg-red-100 border-2 border-red-300 rounded-lg p-4">
                              <div class="flex items-center gap-3">
                                <AlertTriangle class="w-6 h-6 text-red-600 flex-shrink-0" />
                                <div class="flex-1">
                                  <p class="text-red-900 font-bold mb-1">
                                    این کتاب {overdueDays} روز دیرکرد دارد!
                                  </p>
                                  <p class="text-red-700">
                                    جریمه قابل پرداخت: <strong class="text-xl">{formatCurrency(lateFee)}</strong>
                                  </p>
                                  <p class="text-sm text-red-600 mt-2">
                                    💡 این جریمه هنگام بازگشت کتاب به کتابخانه دریافت خواهد شد.
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* وضعیت */}
                        <div class="flex flex-col items-end gap-3">
                          <span class={`flex items-center gap-2 px-4 py-3 rounded-lg font-medium border-2 ${getStatusColor(reservation.actualStatus)}`}>
                            {getStatusIcon(reservation.actualStatus)}
                            <span class="text-sm">{getStatusText(reservation.actualStatus)}</span>
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* راهنما */}
          {actualReservations.length > 0 && (
            <div class="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-6">
              <h3 class="font-bold text-blue-900 mb-3">📚 راهنمای استفاده</h3>
              <ul class="space-y-2 text-sm text-blue-800">
                <li class="flex items-start gap-2">
                  <span class="text-blue-600">•</span>
                  <span><strong>امانت گرفته شده:</strong> کتاب در دست شماست و در حال مطالعه می‌باشید</span>
                </li>
                <li class="flex items-start gap-2">
                  <span class="text-green-600">•</span>
                  <span><strong>بازگشت داده شده:</strong> کتاب را به کتابخانه بازگردانده‌اید (تاریخچه)</span>
                </li>
                <li class="flex items-start gap-2">
                  <span class="text-red-600">•</span>
                  <span><strong>دیرکرد:</strong> مهلت بازگشت کتاب گذشته است - باید هرچه سریعتر کتاب را برگردانید و جریمه را پرداخت کنید</span>
                </li>
                <li class="flex items-start gap-2 mt-4 pt-3 border-t border-blue-200">
                  <span class="text-orange-600">💰</span>
                  <span><strong>نرخ جریمه:</strong> 5,000 تومان به ازای هر روز تاخیر در بازگشت کتاب</span>
                </li>
              </ul>
            </div>
          )}
        </div>
      </section>

    </div>
</template> -->
<template></template>
