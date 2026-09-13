import type { BookProps, Category } from "../repository/booksStore";
import { httpPostFormData } from "./setup";

export interface API_Add_Book_Input {
  title: string;
  author: string;
  ISBN: string;
  category: Category;
  total: number;
  description?: string;
  coverImage?: File;
}

export interface API_Add_Book_Output {
  result: BookProps[];
  message: string;
}

export function API_Add_New_Book(body: API_Add_Book_Input) {
  const formData = new FormData();
  formData.append("title", body.title);
  formData.append("author", body.author);
  formData.append("ISBN", body.ISBN);
  formData.append("category", body.category);
  formData.append("total", String(body.total));
  if (body.description) formData.append("description", body.description);
  if (body.coverImage) formData.append("coverImage", body.coverImage);
  return httpPostFormData<API_Add_Book_Output>(`/books/create`, formData);
}
