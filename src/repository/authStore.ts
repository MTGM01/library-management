import { defineStore } from "pinia";
import {
  API_User_Login,
  type API_User_Login_Input,
} from "../datasource/LoginAPI";
import { API_Users_GetStatus } from "../datasource/UserAPI";
import { getKey, removeKey, setKey } from "../datasource/keyval";
import {
  setBlockedHandler,
  setUnauthenticatedHandler,
} from "../datasource/setup";
import { showToast } from "../helper/showToast";
import type { BookProps } from "./booksStore";

export type UserRole = "ADMIN" | "USER";
export type UserStatus = "ACTIVE" | "BLOCK";

export interface UserProps {
  _id: string;
  userName: string;
  password: string;
  mobile: string;
  crime: number;
  role: UserRole;
  reservedBooks: (string | BookProps)[];
  dueDate: Date;
  firstName: string;
  lastName: string;
  status: UserStatus;
  createdAt: Date;
  updatedAt: Date;
}

const AUTH_KEY = "isAuthenticated";
const PROFILE_KEY = "user-profile";
const ROLE_KEY = "user-role";

export const BLOCKED_MESSAGE =
  "حساب کاربری شما مسدود شده است. لطفاً به صورت حضوری به کتابخانه مراجعه کنید.";

async function navigateToLogin() {
  try {
    const { default: router } = await import("../router");
    if (
      router.currentRoute.value.name === "login" &&
      !router.currentRoute.value.query.redirect
    ) {
      return;
    }
    await router.push({ name: "login" }).catch(() => {});
  } catch {
    if (window.location.pathname !== "/login") {
      window.location.assign("/login");
    }
  }
}

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
    isBlocked: (state) => state.profile?.status === "BLOCK",
    /**
     * Authentication middleware check: a session is valid only when the
     * isAuthenticated flag AND a stored user-profile (with id) both exist.
     * Either one missing means the user must go back to the login page.
     */
    hasValidSession: (state) =>
      state.isAuthenticated === true && !!state.profile?._id,
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

    removeReservedBook(bookId: string) {
      if (!this.profile) return;

      this.profile = {
        ...this.profile,
        reservedBooks: this.profile.reservedBooks.filter((id) => id !== bookId),
      };
      this.persist();
    },

    /**
     * Registers the global auth middlewares:
     * - blocked handler: 401/403 from a protected endpoint, or a locally
     *   stored BLOCKed profile → toast + logout + login redirect.
     * - unauthenticated handler: a protected API call attempted with no
     *   valid session (missing isAuthenticated flag or user-profile) →
     *   silent logout + login redirect.
     */
    initAuthMiddleware() {
      setBlockedHandler(() => {
        void this.forceLogoutBlocked();
      });
      setUnauthenticatedHandler(() => {
        void this.handleUnauthenticated();
      });
    },

    initBlockedHandler() {
      this.initAuthMiddleware();
    },

    initForbiddenHandler() {
      this.initBlockedHandler();
    },

    async forceLogoutBlocked() {
      const wasAuthenticated = this.isAuthenticated;
      this.logout();
      if (wasAuthenticated) {
        showToast("error", BLOCKED_MESSAGE);
      }
      await navigateToLogin();
    },

    /**
     * Authentication middleware action: clears any half-written session
     * leftovers and sends the user to the login page (no blocked toast —
     * the session simply does not exist).
     */
    async handleUnauthenticated() {
      this.logout();
      await navigateToLogin();
    },

    async refreshSessionStatus(): Promise<boolean> {
      if (!this.hasValidSession || !this.profile?._id) {
        return false;
      }

      if (this.profile.status === "BLOCK") {
        await this.forceLogoutBlocked();
        throw new Error("USER_BLOCKED");
      }

      try {
        const response = await API_Users_GetStatus(this.profile._id);
        const freshStatus = response.result.status;

        if (freshStatus !== this.profile.status) {
          this.profile = { ...this.profile, status: freshStatus };
          this.persist();
        }

        if (freshStatus === "BLOCK") {
          await this.forceLogoutBlocked();
          throw new Error("USER_BLOCKED");
        }
        return true;
      } catch (error: any) {
        if (error?.message === "USER_BLOCKED") throw error;
        if (error?.status === 404) {
          await this.forceLogoutBlocked();
          throw new Error("USER_BLOCKED");
        }
        if (error?.status === 401 || error?.status === 403) {
          throw error;
        }
        console.error(error);
        return true;
      }
    },

    async login(body: API_User_Login_Input) {
      try {
        const result = await API_User_Login(body);

        if (result.result.status === "BLOCK") {
          showToast("error", BLOCKED_MESSAGE);
          throw new Error("USER_BLOCKED");
        }

        this.isAuthenticated = true;
        this.profile = result.result;
        this.role = result.result.role;
        this.persist();

        if (result.message === "You are logged in successfully") {
          showToast("success", "با موفقیت وارد شدید");
        }

        return result;
      } catch (error: any) {
        console.error(error);
        if (error.message === "USER_BLOCKED") {
          throw error;
        }
        if (error instanceof TypeError && error.message.includes("fetch")) {
          showToast("error", "اتصال به اینترنت برقرار نیست");
        } else if (error.status >= 500 && error.status < 600) {
          showToast(
            "error",
            "خطای سرور. لطفاً بعداً تلاش کنید یا با پشتیبانی تماس بگیرید.",
          );
        } else if (error.message && error.message.includes("401")) {
          showToast("error", "نام کاربری یا رمز عبور اشتباه است");
        } else if (error.message && error.message.includes("404")) {
          showToast("error", "کاربر یافت نشد");
        } else {
          showToast("error", "خطا در ورود به سیستم");
        }
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
