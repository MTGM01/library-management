import { defineStore } from "pinia";
import { API_Users_List, API_Users_Add, API_Users_UpdateStatus } from "../datasource/UserAPI";
import type { API_Users_Add_Input } from "../datasource/UserAPI";
import type { UserProps, UserStatus } from "./authStore";
import { showToast } from "../helper/showToast";
import { isSessionRevokedError } from "../helper/sessionError";
import {
  SERVER_ERROR_MESSAGE,
  getNetworkErrorMessage,
  isNetworkError,
  isServerError,
} from "../helper/httpError";

export const useUsersStore = defineStore("users", {
  state: () => ({
    users: [] as UserProps[],
    searchQuery: "",
    statusFilter: "ALL" as "ALL" | UserStatus,
    isLoading: false,
  }),

  getters: {
    filteredUsers: (state) => {
      const query = state.searchQuery.trim().toLowerCase();

      return state.users.filter((user) => {
        const matchesSearch =
          !query ||
          user.firstName.toLowerCase().includes(query) ||
          user.lastName.toLowerCase().includes(query);
        const matchesStatus =
          state.statusFilter === "ALL" || user.status === state.statusFilter;

        return matchesSearch && matchesStatus;
      });
    },
    activeUsersCount: (state) =>
      state.users.filter((user) => user.status === "ACTIVE").length,
    reservationsCount: (state) =>
      state.users.reduce((sum, user) => sum + user.reservedBooks.length, 0),
  },

  actions: {
    async fetchUsers() {
      this.isLoading = true;
      try {
        const plainUsers = (await API_Users_List()).result.filter(
          (user) => user.role === "USER",
        );
        this.users = plainUsers;
      } catch (error: any) {
        console.error(error);
        if (isSessionRevokedError(error)) throw error;
        if (isServerError(error)) {
          showToast("error", SERVER_ERROR_MESSAGE);
        } else if (isNetworkError(error)) {
          showToast("error", getNetworkErrorMessage());
        } else {
          showToast("error", "خطا در دریافت لیست کاربران");
        }
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    async updateUserStatus(userId: string, status: UserStatus) {
      try {
        const response = await API_Users_UpdateStatus({ id: userId, status });
        const updatedUser = response.result;
        
        const index = this.users.findIndex((user) => user._id === userId);
        if (index !== -1) {
          this.users[index] = updatedUser;
        }
        
        showToast("success", status === "ACTIVE" ? "کاربر فعال شد" : "کاربر مسدود شد");
        return updatedUser;
      } catch (error: any) {
        console.error(error);
        if (isSessionRevokedError(error)) throw error;
        if (isServerError(error)) {
          showToast("error", SERVER_ERROR_MESSAGE);
        } else if (isNetworkError(error)) {
          showToast("error", getNetworkErrorMessage());
        } else {
          showToast("error", "خطا در تغییر وضعیت کاربر");
        }
        throw error;
      }
    },

    async addUser(body: API_Users_Add_Input) {
      try {
        const response = await API_Users_Add(body);
        const newUser = response.result;
        this.users.push(newUser);
        showToast("success", "کاربر جدید با موفقیت ایجاد شد");
        return newUser;
      } catch (error: any) {
        console.error(error);
        if (isSessionRevokedError(error)) throw error;
        if (isServerError(error)) {
          showToast("error", SERVER_ERROR_MESSAGE);
        } else if (isNetworkError(error)) {
          showToast("error", getNetworkErrorMessage());
        } else {
          showToast("error", "خطا در ایجاد کاربر جدید");
        }
        throw error;
      }
    },

    setStatusFilter(status: "ALL" | UserStatus) {
      this.statusFilter = status;
    },
  },
});
