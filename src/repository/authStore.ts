import { defineStore } from "pinia";
import {
  API_User_Login,
  type API_User_Login_Input,
} from "../datasource/LoginAPI";
import { getKey, removeKey, setKey } from "../datasource/keyval";
import { showToast } from "../helper/showToast";

export type UserRole = "ADMIN" | "USER";
export type UserStatus = "ACTIVE" | "BLOCK";

export interface UserProps {
  _id: string;
  userName: string;
  password: string;
  mobile: string;
  crime: number;
  role: UserRole;
  reservedBooks: string[];
  dueDate: Date;
  firstName: string;
  lastName: string;
  status: UserStatus;
  createdAt: Date;
}

const AUTH_KEY = "isAuthenticated";
const PROFILE_KEY = "user-profile";
const ROLE_KEY = "user-role";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    isAuthenticated: getKey<boolean>(AUTH_KEY) ?? false,
    profile: getKey<UserProps>(PROFILE_KEY),
    role: getKey<UserRole>(ROLE_KEY),
  }),

  getters: {
    userName: (state) => state.profile?.userName ?? "",
    mobile: (state) => state.profile?.mobile ?? "",
    isAdmin: (state) => state.role === "ADMIN",
    isUser: (state) => state.role === "USER",
  },

  actions: {
    persist() {
      setKey(AUTH_KEY, this.isAuthenticated);

      if (this.profile) {
        setKey(PROFILE_KEY, this.profile);
      } else {
        removeKey(PROFILE_KEY);
      }

      if (this.role) {
        setKey(ROLE_KEY, this.role);
      } else {
        removeKey(ROLE_KEY);
      }
    },

    setProfile(profile: UserProps | null) {
      this.profile = profile;
      this.persist();
    },

    setRole(role: UserRole | null) {
      this.role = role;
      this.persist();
    },

    addReservedBook(bookId: string) {
      if (!this.profile) return;
      if (this.profile.reservedBooks.includes(bookId)) return;

      this.profile = {
        ...this.profile,
        reservedBooks: [...this.profile.reservedBooks, bookId],
      };
      this.persist();
    },

    async login(body: API_User_Login_Input) {
      try {
        const result = await API_User_Login(body);
        this.isAuthenticated = true;
        this.profile = result.result;
        this.role = result.result.role;
        this.persist();

        if (result.message === "You are logged in successfully") {
          showToast("success", "با موفقیت وارد شدید");
        }

        return result;
      } catch (error: any) {
        showToast(
          "error",
          "کاربر یافت نشد ! (نام کاربری و رمز عبور خود را با دقت وارد کنید)",
        );
        showToast("error", "اتصال به اینترنت خود را چک کنید");
        console.error(error);
        throw error;
      }
    },

    logout() {
      this.isAuthenticated = false;
      this.profile = null;
      this.role = null;
      removeKey(AUTH_KEY);
      removeKey(PROFILE_KEY);
      removeKey(ROLE_KEY);
    },
  },
});
