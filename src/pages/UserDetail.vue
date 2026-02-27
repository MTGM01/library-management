<!-- <script setup lang="ts">
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { ArrowRight, User as UserIcon, Mail, Phone, Calendar, BookOpen, CheckCircle, Clock, XCircle, AlertTriangle, DollarSign } from 'lucide-react';
import { Header } from './Header';
import { Footer } from './Footer';
import { mockUsers, mockReservations, User, Reservation } from '../data/mockData';
import { UserRole } from '../App';
import { getActualReservationStatus, calculateOverdueDays, calculateLateFee, formatCurrency } from '../utils/dateHelpers';

export function UserDetail() {
  const navigate = useNavigate();
  const { userId } = useParams<{ userId: string }>();
  
  // دریافت رزروها از localStorage و ترکیب با mockReservations
  const [reservations, setReservations] = useState<Reservation[]>(() => {
    const savedReservations = JSON.parse(localStorage.getItem('reservations') || '[]');
    const allReservations = [...mockReservations, ...savedReservations];
    return allReservations.filter(r => r.userId === userId);
  });

  const user = mockUsers.find(u => u.id === userId);

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

  const handleMarkAsDelivered = (reservationId: string) => {
    if (window.confirm('آیا کتاب به کاربر تحویل داده شد؟')) {
      const updatedReservations = reservations.map(r =>
        r.id === reservationId
          ? { ...r, status: 'borrowed' as const }
          : r
      );
      setReservations(updatedReservations);
      
      // ذخیره در localStorage
      const savedReservations = JSON.parse(localStorage.getItem('reservations') || '[]');
      const updatedSaved = savedReservations.map((r: Reservation) =>
        r.id === reservationId ? { ...r, status: 'borrowed' } : r
      );
      localStorage.setItem('reservations', JSON.stringify(updatedSaved));
    }
  };

  const handleMarkAsReturned = (reservationId: string) => {
    const reservation = actualReservations.find(r => r.id === reservationId);
    if (!reservation) return;
    
    const overdueDays = reservation.actualStatus === 'overdue' 
      ? calculateOverdueDays(reservation.dueDate) 
      : 0;
    const lateFee = overdueDays > 0 ? calculateLateFee(overdueDays) : 0;
    
    let confirmMessage = 'آیا کتاب از کاربر بازگشت داده شد؟';
    
    if (lateFee > 0) {
      confirmMessage = `این کتاب ${overdueDays} روز دیرکرد دارد.\n\nجریمه قابل دریافت: ${formatCurrency(lateFee)}\n\nآیا کتاب بازگشت داده شد و جریمه دریافت شد؟`;
    }
    
    if (window.confirm(confirmMessage)) {
      const today = new Date().toLocaleDateString('fa-IR');
      const updatedReservations = reservations.map(r =>
        r.id === reservationId
          ? { ...r, status: 'returned' as const, returnDate: today }
          : r
      );
      setReservations(updatedReservations);
      
      // ذخیره در localStorage
      const savedReservations = JSON.parse(localStorage.getItem('reservations') || '[]');
      const updatedSaved = savedReservations.map((r: Reservation) =>
        r.id === reservationId ? { ...r, status: 'returned', returnDate: today } : r
      );
      localStorage.setItem('reservations', JSON.stringify(updatedSaved));
      
      if (lateFee > 0) {
        alert(`✅ کتاب بازگشت داده شد و جریمه ${formatCurrency(lateFee)} دریافت شد.`);
      }
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50" dir="rtl">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">کاربر یافت نشد</h2>
          <button
            onClick={() => navigate('/users')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            بازگشت به لیست کاربران
          </button>
        </div>
      </div>
    );
  }

  const getStatusIcon = (status: Reservation['status']) => {
    switch (status) {
      case 'reserved':
        return <Clock className="w-5 h-5 text-blue-600" />;
      case 'borrowed':
        return <BookOpen className="w-5 h-5 text-orange-600" />;
      case 'returned':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'overdue':
        return <AlertTriangle className="w-5 h-5 text-red-600" />;
    }
  };

  const getStatusText = (status: Reservation['status']) => {
    switch (status) {
      case 'reserved':
        return 'رزرو شده';
      case 'borrowed':
        return 'تحویل داده شده';
      case 'returned':
        return 'بازگشت داده شده';
      case 'overdue':
        return 'دیرکرد';
    }
  };

  const getStatusColor = (status: Reservation['status']) => {
    switch (status) {
      case 'reserved':
        return 'bg-blue-100 text-blue-700';
      case 'borrowed':
        return 'bg-orange-100 text-orange-700';
      case 'returned':
        return 'bg-green-100 text-green-700';
      case 'overdue':
        return 'bg-red-100 text-red-700';
    }
  };

  // محاسبه آمار با در نظر گرفتن وضعیت واقعی
  const actualReservations = reservations.map(r => ({
    ...r,
    actualStatus: getActualReservationStatus(r.status, r.dueDate)
  }));

  const reservedCount = actualReservations.filter(r => r.actualStatus === 'reserved').length;
  const borrowedCount = actualReservations.filter(r => r.actualStatus === 'borrowed').length;
  const returnedCount = actualReservations.filter(r => r.actualStatus === 'returned').length;
  const overdueCount = actualReservations.filter(r => r.actualStatus === 'overdue').length;

  // محاسبه کل جریمه
  const totalLateFee = actualReservations
    .filter(r => r.actualStatus === 'overdue')
    .reduce((sum, r) => sum + calculateLateFee(calculateOverdueDays(r.dueDate)), 0);
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
            {/* دکمه بازگشت */}
            <button
            onClick={() => navigate('/users')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
            >
            <ArrowRight className="w-5 h-5" />
            <span>بازگشت به لیست کاربران</span>
          </button>
          
          {/* اطلاعات کاربر */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-3xl text-blue-600 font-bold">
                    {user.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">{user.name}</h1>
                  <div className="flex flex-col gap-2 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      <span>{user.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      <span dir="ltr">{user.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>عضویت از {user.joinDate}</span>
                    </div>
                  </div>
                </div>
              </div>
              <span className={`px-4 py-2 rounded-full text-sm font-medium ${
                user.status === 'active'
                ? 'bg-green-100 text-green-700'
                : 'bg-red-100 text-red-700'
              }`}>
              {user.status === 'active' ? 'فعال' : 'مسدود'}
            </span>
          </div>
        </div>
        
        {/* آمار رزروها */}
        <div className="grid grid-cols-5 gap-4 mb-6">
          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">کل رزروها</p>
                <p className="text-3xl font-bold text-gray-900">{reservations.length}</p>
              </div>
              <BookOpen className="w-10 h-10 text-gray-400" />
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">رزروهای فعال</p>
                <p className="text-3xl font-bold text-orange-600">{borrowedCount}</p>
              </div>
              <Clock className="w-10 h-10 text-orange-600" />
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">بازگشت داده شده</p>
                <p className="text-3xl font-bold text-green-600">{returnedCount}</p>
              </div>
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">دیرکرد</p>
                <p className="text-3xl font-bold text-red-600">{overdueCount}</p>
              </div>
              <AlertTriangle className="w-10 h-10 text-red-600" />
            </div>
          </div>
          
          <div className={`p-6 rounded-xl border-2 ${totalLateFee > 0 ? 'bg-red-50 border-red-300' : 'bg-white border-gray-200'}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">جریمه دیرکرد</p>
                <p className={`text-2xl font-bold ${totalLateFee > 0 ? 'text-red-600' : 'text-gray-900'}`}>
                  {formatCurrency(totalLateFee)}
                </p>
              </div>
              <DollarSign className={`w-10 h-10 ${totalLateFee > 0 ? 'text-red-600' : 'text-gray-400'}`} />
              </div>
            </div>
          </div>
          
          {/* هشدار دیرکرد */}
          {overdueCount > 0 && (
            <div className="bg-red-50 border-2 border-red-300 rounded-xl p-6 mb-6">
              <div className="flex items-start gap-4">
                <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-red-900 mb-2">
                    ⚠️ هشدار: این کاربر {overdueCount} کتاب دیرکرد دارد
                  </h3>
                  <p className="text-red-700 mb-3">
                    جمع جریمه دیرکرد: <strong className="text-xl">{formatCurrency(totalLateFee)}</strong> 
                    <span className="text-sm mr-2">(5,000 تومان به ازای هر روز تاخیر)</span>
                  </p>
                  <p className="text-sm text-red-600">
                    💡 لطفاً با کاربر تماس بگیرید و او را برای بازگشت کتاب‌ها و پرداخت جریمه دعوت کنید.
                  </p>
                </div>
              </div>
            </div>
            )}
            
            {/* راهنمای استفاده */}
            <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-6 mb-6">
              <h3 className="font-bold text-blue-900 mb-4 text-lg">📚 راهنمای مدیریت رزروها</h3>
              
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h4 className="font-bold text-blue-800 mb-3">وضعیت‌ها:</h4>
                  <ul className="space-y-2 text-sm text-blue-800">
                    <li className="flex items-start gap-2">
                      <BookOpen className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <strong>امانت گرفته شده:</strong> کتاب در دست کاربر است. وقتی کتاب را پس می‌گیرید، دکمه "بازگشت از کاربر" را بزنید.
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <strong>بازگشت داده شده:</strong> کتاب به کتابخانه برگشته است (تاریخچه).
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <strong>دیرکرد:</strong> تاریخ موعد گذشته! این وضعیت <strong>خودکار</strong> تشخیص داده می‌شود و جریمه محاسبه می‌شود.
                      </div>
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-bold text-blue-800 mb-3">دریافت جریمه دیرکرد:</h4>
                  <div className="bg-white border border-blue-200 rounded-lg p-4 space-y-3">
                    <div className="flex items-center gap-3">
                      <DollarSign className="w-6 h-6 text-blue-600" />
                      <div>
                        <p className="font-bold text-blue-900">نرخ: 5,000 تومان / روز</p>
                        <p className="text-xs text-blue-600">به ازای هر روز تاخیر</p>
                      </div>
                    </div>
                    
                    <div className="border-t border-blue-200 pt-3">
                      <p className="text-sm text-blue-800 mb-2"><strong>نحوه عملکرد:</strong></p>
                      <ul className="text-xs text-blue-700 space-y-1 list-disc list-inside">
                        <li>سیستم خودکار دیرکرد را تشخیص می‌دهد</li>
                        <li>وقتی دکمه "ثبت بازگشت + دریافت جریمه" را می‌زنید، مبلغ جریمه نمایش داده می‌شود</li>
                        <li>بعد از تایید، جریمه را از کاربر دریافت کنید</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* لیست رزروها */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                <h2 className="text-xl font-bold text-gray-900">تاریخچه رزروها</h2>
              </div>
              
              <div className="divide-y divide-gray-200">
                {reservations.length === 0 ? (
                  <div className="text-center py-12">
                    <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">هیچ رزروی ثبت نشده است</p>
                  </div>
                  ) : (
                    actualReservations.map((reservation) => {
                      const overdueDays = reservation.actualStatus === 'overdue' 
                      ? calculateOverdueDays(reservation.dueDate) 
                      : 0;
                      const lateFee = overdueDays > 0 ? calculateLateFee(overdueDays) : 0;
                      
                      return (
                        <div key={reservation.id} className="p-6 hover:bg-gray-50 transition-colors">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-4 flex-1">
                              {/* تصویر کتاب */}
                              <div className="w-16 h-20 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                                <BookOpen className="w-8 h-8 text-gray-400" />
                              </div>
                              
                              {/* اطلاعات کتاب */}
                              <div className="flex-1">
                                <h3 className="font-bold text-gray-900 mb-1">{reservation.bookTitle}</h3>
                                <p className="text-sm text-gray-600 mb-2">{reservation.bookAuthor}</p>
                                <div className="flex items-center gap-4 text-sm text-gray-500">
                                  <span>رزرو: {reservation.reservationDate}</span>
                                  <span>•</span>
                                  <span className={reservation.actualStatus === 'overdue' ? 'text-red-600 font-bold' : ''}>
                                    موعد: {reservation.dueDate}
                                  </span>
                                  {reservation.returnDate && (
                                    <>
                                    <span>•</span>
                                    <span>بازگشت: {reservation.returnDate}</span>
                                    </>
                                    )}
                                  </div>
                                  
                                  {/* نمایش اطلاعات دیرکرد */}
                                  {reservation.actualStatus === 'overdue' && (
                                    <div className="mt-3 bg-red-100 border border-red-300 rounded-lg p-3">
                                      <div className="flex items-center gap-2 text-sm">
                                        <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0" />
                                        <span className="text-red-700">
                                          <strong>{overdueDays} روز</strong> دیرکرد - جریمه: <strong>{formatCurrency(lateFee)}</strong>
                                        </span>
                                      </div>
                                    </div>
                            )}
                          </div>

                          {/* وضعیت */}
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <span className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium ${getStatusColor(reservation.actualStatus)}`}>
                              {getStatusIcon(reservation.actualStatus)}
                              {getStatusText(reservation.actualStatus)}
                            </span>
                          </div>
                        </div>
                        
                        {/* دکمه‌های عملیات */}
                        <div className="flex flex-col items-end gap-2 mr-4 flex-shrink-0">
                          {reservation.actualStatus === 'reserved' && (
                            <button
                            onClick={() => handleMarkAsDelivered(reservation.id)}
                            className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-sm whitespace-nowrap"
                            >
                            تحویل به کاربر
                          </button>
                          )}
                          {(reservation.actualStatus === 'borrowed' || reservation.actualStatus === 'overdue') && (
                            <button
                            onClick={() => handleMarkAsReturned(reservation.id)}
                            className={`px-4 py-2 text-white rounded-lg transition-colors text-sm whitespace-nowrap ${
                              reservation.actualStatus === 'overdue'
                              ? 'bg-red-600 hover:bg-red-700'
                              : 'bg-green-600 hover:bg-green-700'
                            }`}
                            >
                            {reservation.actualStatus === 'overdue' ? 'ثبت بازگشت + دریافت جریمه' : 'بازگشت از کاربر'}
                          </button>
                          )}
                        </div>
                      </div>
                    </div>
                    );
                  })
                  )}
                </div>
              </div>
            </div>
          </main>
          
          <Footer />
        </div>
      </template> -->
<template></template>
