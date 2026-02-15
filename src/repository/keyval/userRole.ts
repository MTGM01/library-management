import { getKey, setKey } from "../../datasource/keyval";
import type { UserRole } from "../user";

/**
 * ذخیره نقش کاربر در حافظه دائمی
 */
export function User_SetRole(userRole: UserRole) {
  setKey("user-role", userRole);
}

/**
 * دریافت نقش کاربر از حافظه دائمی
 */
export function User_GetRole(): UserRole {
  return getKey("user-role");
}
