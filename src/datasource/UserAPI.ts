import type { UserProps } from "../repository/user";
import { httpGet } from "./setup";

export interface API_Users_List_Output {
  result: UserProps[];
}

export function API_Users_List() {
  return httpGet<API_Users_List_Output>(`/users`);
}
