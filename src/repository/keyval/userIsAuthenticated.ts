import { setKey } from "../../datasource/keyval";

/** ذخیره وضعیت لاگین (احراز هویت) کاربر  */
export function User_SetIsAuthenticated(isAuth: boolean) {
  setKey("isAuthenticated", isAuth);
}
