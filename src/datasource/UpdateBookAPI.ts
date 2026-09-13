import type { BookProps, Category } from "../repository/booksStore";
import { httpPutFormData } from "./setup";

export interface API_Update_Book_Input {
  id: string;
  title?: string;
  author?: string;
  ISBN?: string;
  category?: Category;
  total?: number;
  availableCount?: number;
  description?: string;
  coverImage?: File | string;
}

export interface API_Update_Book_Output {
  result: BookProps;
  message: string;
}

export function API_Update_Book(body: API_Update_Book_Input) {
  const formData = new FormData();
  formData.append("id", body.id);
  if (body.title !== undefined) formData.append("title", body.title);
  if (body.author !== undefined) formData.append("author", body.author);
  if (body.ISBN !== undefined) formData.append("ISBN", body.ISBN);
  if (body.category !== undefined) formData.append("category", body.category);
  if (body.total !== undefined) formData.append("total", String(body.total));
  if (body.availableCount !== undefined)
    formData.append("availableCount", String(body.availableCount));
  if (body.description !== undefined)
    formData.append("description", body.description);
  if (body.coverImage !== undefined) {
    if (body.coverImage instanceof File) {
      formData.append("coverImage", body.coverImage);
    } else if (typeof body.coverImage === "string") {
      formData.append("coverImage", body.coverImage);
    }
  }
  return httpPutFormData<API_Update_Book_Output>(`/books/update`, formData);
}
