import { getKey, setKey } from "../../datasource/keyval";
import type { UserProps } from "../user";

/**
 * ذخیره پروفایل کاربر در حافظه دائمی
 * این تابع نام کاربری و پسورد و شماره موبایل و مبلغ جریمه و لیست کتاب های رزرو شده توسط کاربر و نقش کاربر را در حافظه ذخیره می‌کند تا در دفعات بعدی بتوان از آن استفاده کرد
 */
export function User_SetProfile(userProfile: UserProps) {
  setKey("user-profile", userProfile);
}

/**
 * دریافت پروفایل کاربر از حافظه دائمی
 * این تابع اطلاعات کاربر را که کاربر قبلاً لاگین کرده است از حافظه می‌خواند
 */
export function User_GetProfile(): UserProps {
  return getKey("user-profile");
}
