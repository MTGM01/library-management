import type { UserProps } from "../repository/authStore";
import type { BookProps } from "../repository/booksStore";
import { httpPost } from "./setup";

export interface API_Reserve_Book_Input {
  userID: string;
  bookID: string;
}

export interface API_Reserve_Book_Output {
  result: {
    user: UserProps;
    book: BookProps;
    createdAt: Date;
    updatedAt: Date;
    _id: string;
    __v: number;
  };
  message: string;
}

export function API_Reserve_Book(body: API_Reserve_Book_Input) {
  return httpPost<API_Reserve_Book_Output>(`/reservedBooks/reserve`, body);
}
