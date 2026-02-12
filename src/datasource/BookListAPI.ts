import type { Category } from "../components/Sidebar.vue";
import { httpGet } from "./setup";

export interface API_Book_List_Input {
  category: Category;
}

export interface API_Book_List_Output {
  /** عنوان */
  title: string;
  /** نویسنده */
  author: string;
  /** قیمت */
  price: number;
  /** شماره شابک */
  ISBN: string;
  /** نام دسته بندی */
  category: Category;
  /** توضیحات */
  description: string;
}

export function API_Otp_SendByMobile(body: API_Book_List_Input) {
  return httpGet<API_Book_List_Output>(`/books/${body.category}`);
}
