import type { UserProps } from "../repository/authStore";
import type { BookProps } from "../repository/booksStore";
import { httpPost, httpDeleteWithQuery } from "./setup";

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

export interface API_Deliver_Book_Input {
  userID: string;
  bookID: string;
}

export interface API_Deliver_Book_Output {
  result: {
    reservedBook: any;
    deliveredBook: BookProps;
    userThatReservedTheBook: UserProps;
  };
  message: string;
}

export function API_Deliver_Book(params: API_Deliver_Book_Input) {
  return httpDeleteWithQuery<API_Deliver_Book_Output>(
    `/reservedBooks/delivery`,
    { bookID: params.bookID, userID: params.userID },
  );
}
