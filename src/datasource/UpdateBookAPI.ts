import type { BookProps, Category } from "../repository/book";
import { httpPut } from "./setup";

export interface API_Update_Book_Input {
  id: string;
  title?: string;
  author?: string;
  ISBN?: string;
  category?: Category;
  total?: number;
  availableCount?: number;
  description?: string;
}

export interface API_Update_Book_Output {
  result: BookProps;
  message: string;
}

export function API_Update_Book(body: API_Update_Book_Input) {
  return httpPut<API_Update_Book_Output>(`/books/update`, body);
}
