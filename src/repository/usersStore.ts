import { defineStore } from "pinia";
import { API_Users_List } from "../datasource/UserAPI";
import type { UserProps, UserStatus } from "./authStore";

export const useUsersStore = defineStore("users", {
  state: () => ({
    users: [] as UserProps[],
    searchQuery: "",
    statusFilter: "ALL" as "ALL" | UserStatus,
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
      const plainUsers = (await API_Users_List()).result.filter(
        (user) => user.role === "USER",
      );
      this.users = plainUsers;
    },

    setStatusFilter(status: "ALL" | UserStatus) {
      this.statusFilter = status;
    },
  },
});
