import type { UserProps } from "../repository/authStore";
import { httpGet, httpPost, httpPut } from "./setup";

export interface API_Users_List_Output {
  result: UserProps[];
}

export function API_Users_List() {
  return httpGet<API_Users_List_Output>(`/users`);
}

export interface API_Users_Add_Input {
  firstName: string;
  lastName: string;
  userName: string;
  password: string;
  mobile: string;
  role?: "ADMIN" | "USER";
  status?: "ACTIVE" | "BLOCK";
}

export interface API_Users_Add_Output {
  result: UserProps;
  message: string;
}

export function API_Users_Add(body: API_Users_Add_Input) {
  return httpPost<API_Users_Add_Output>(`/users/admin/add`, body);
}

export interface API_Users_UpdateStatus_Input {
  id: string;
  status: "ACTIVE" | "BLOCK";
}

export interface API_Users_UpdateStatus_Output {
  result: UserProps;
  message: string;
}

export function API_Users_UpdateStatus(body: API_Users_UpdateStatus_Input) {
  return httpPut<API_Users_UpdateStatus_Output>(`/users/setStatus`, body);
}

export interface API_Users_GetStatus_Output {
  result: { _id: string; status: "ACTIVE" | "BLOCK" };
  message: string;
}

export function API_Users_GetStatus(userId: string) {
  return httpGet<API_Users_GetStatus_Output>(`/users/status/${userId}`);
}
