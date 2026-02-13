import type { BookProps, Category } from "../components/repository/book";
import { httpGet } from "./setup";

export interface API_Book_List_Input {
  category: Category;
}

export interface API_Book_List_Output {
  result: BookProps[];
}

export function API_Book_List(body: API_Book_List_Input) {
  return httpGet<API_Book_List_Output>(`/books?category=${body.category}`);
}
