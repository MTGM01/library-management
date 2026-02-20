import type { BookProps } from "../repository/book";
import { httpDelete } from "./setup";

export interface API_Remove_Book_Input {
  id: string;
}

export interface API_Remove_Book_Output {
  result: BookProps;
  message: string;
}

export function API_Remove_Book(body: API_Remove_Book_Input) {
  return httpDelete<API_Remove_Book_Output>(`/books/remove`, body);
}
