import { defineStore } from "pinia";
import {
  API_Add_New_Book,
  type API_Add_Book_Input,
} from "../datasource/AddBookAPI";
import {
  API_Book_List,
  type API_Book_List_Output,
} from "../datasource/BookListAPI";
import {
  API_Remove_Book,
  type API_Remove_Book_Input,
} from "../datasource/DeleteBookAPI";
import {
  API_Reserve_Book,
  type API_Reserve_Book_Input,
} from "../datasource/ReserveBookAPI";
import {
  API_Update_Book,
  type API_Update_Book_Input,
} from "../datasource/UpdateBookAPI";
import { showToast } from "../helper/showToast";
import { isSessionRevokedError } from "../helper/sessionError";
import {
  SERVER_ERROR_MESSAGE,
  getNetworkErrorMessage,
  isNetworkError,
  isServerError,
} from "../helper/httpError";

export type Category =
  | "all"
  | "computer"
  | "literature"
  | "history"
  | "sciences"
  | "story"
  | "psychology";

export type CategoryEnum = { title: string; value: Category };

export interface BookProps {
  _id: string;
  title: string;
  author: string;
  ISBN: string;
  category: Category;
  total: number;
  availableCount: number;
  description: string;
  coverImage?: string;
}

export type AddBookInput = API_Add_Book_Input;
export type UpdateBookInput = API_Update_Book_Input;
export type RemoveBookInput = API_Remove_Book_Input;
export type ReserveBookInput = API_Reserve_Book_Input;

export const booksCategories: CategoryEnum[] = [
  {
    title: "همه",
    value: "all",
  },
  {
    title: "کامپیوتر",
    value: "computer",
  },
  {
    title: "ادبیات",
    value: "literature",
  },
  {
    title: "تاریخ",
    value: "history",
  },
  {
    title: "علوم",
    value: "sciences",
  },
  {
    title: "داستان",
    value: "story",
  },
  {
    title: "روانشناسی",
    value: "psychology",
  },
];

export const useBooksStore = defineStore("books", {
  state: () => ({
    books: null as BookProps[] | null,
    selectedCategory: "all" as Category,
    searchQuery: "",
    isLoading: false,
  }),

  getters: {
    filteredBooks: (state) => {
      if (!state.books) return null;
      const query = state.searchQuery.trim().toLowerCase();
      if (!query) return state.books;
      return state.books.filter((book) =>
        book.title.toLowerCase().includes(query),
      );
    },
  },

  actions: {
    async fetchBooks(category?: Category): Promise<API_Book_List_Output> {
      const nextCategory = category ?? this.selectedCategory;
      this.selectedCategory = nextCategory;
      this.isLoading = true;
      try {
        const result = await API_Book_List({ category: nextCategory });
        this.books = result.result;
        return result;
      } catch (error: any) {
        console.error(error);
        if (isSessionRevokedError(error)) throw error;
        if (isServerError(error)) {
          showToast("error", SERVER_ERROR_MESSAGE);
        } else if (isNetworkError(error)) {
          showToast("error", getNetworkErrorMessage());
        } else {
          showToast("error", "خطا در دریافت لیست کتاب‌ها");
        }
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    async addBook(book: AddBookInput) {
      try {
        const result = await API_Add_New_Book(book);
        await this.fetchBooks();
        return result;
      } catch (error: any) {
        console.error(error);
        if (isSessionRevokedError(error)) throw error;
        if (isServerError(error)) {
          showToast("error", SERVER_ERROR_MESSAGE);
        } else if (isNetworkError(error)) {
          showToast("error", getNetworkErrorMessage());
        } else {
          showToast("error", "خطا در افزودن کتاب");
        }
        throw error;
      }
    },

    async updateBook(book: UpdateBookInput) {
      try {
        const currentBook = this.books?.find((item) => item._id === book.id);
        const result = await API_Update_Book({
          ...currentBook,
          ...book,
          id: book.id,
        });
        await this.fetchBooks();
        return result;
      } catch (error: any) {
        console.error(error);
        if (isSessionRevokedError(error)) throw error;
        if (isServerError(error)) {
          showToast("error", SERVER_ERROR_MESSAGE);
        } else if (isNetworkError(error)) {
          showToast("error", getNetworkErrorMessage());
        } else {
          showToast("error", "خطا در ویرایش کتاب");
        }
        throw error;
      }
    },

    async removeBook(input: RemoveBookInput) {
      try {
        const result = await API_Remove_Book(input);
        await this.fetchBooks();
        return result;
      } catch (error: any) {
        console.error(error);
        if (isSessionRevokedError(error)) throw error;
        if (isServerError(error)) {
          showToast("error", SERVER_ERROR_MESSAGE);
        } else if (isNetworkError(error)) {
          showToast("error", getNetworkErrorMessage());
        } else {
          showToast("error", "خطا در حذف کتاب");
        }
        throw error;
      }
    },

    async reserveBook(input: ReserveBookInput) {
      try {
        const result = await API_Reserve_Book(input);
        await this.fetchBooks();
        return result;
      } catch (error: any) {
        console.error(error);
        if (isSessionRevokedError(error)) throw error;
        if (isServerError(error)) {
          showToast("error", SERVER_ERROR_MESSAGE);
        } else if (isNetworkError(error)) {
          showToast("error", getNetworkErrorMessage());
        } else {
          showToast("error", "خطا در رزرو کتاب");
        }
        throw error;
      }
    },
  },
});
