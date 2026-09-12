import { defineStore } from "pinia";
import { API_Users_List } from "../datasource/UserAPI";
import type { UserProps, UserStatus } from "./authStore";
import { showToast } from "../helper/showToast";

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
        if (error instanceof TypeError && error.message.includes("fetch")) {
          showToast("error", "اتصال به اینترنت برقرار نیست");
        } else {
          showToast("error", "خطا در دریافت لیست کاربران");
        }
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    setStatusFilter(status: "ALL" | UserStatus) {
      this.statusFilter = status;
    },
  },
});
