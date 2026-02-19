import type { BookProps, Category } from "../repository/book";
import { httpPost } from "./setup";

export interface API_Add_Book_Input {
  title: string;
  author: string;
  ISBN: string;
  category: Category;
  total: number;
  description?: string;
}

export interface API_Add_Book_Output {
  result: BookProps[];
  message: string;
}

export function API_Add_New_Book(body: API_Add_Book_Input) {
  return httpPost<API_Add_Book_Output>(`/books/create`, body);
}
