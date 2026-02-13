import type { UserProps } from "../repository/user";
import { httpPost } from "./setup";

export interface API_User_Login_Input {
  userName: string;
  password: string;
}

export interface API_User_Login_Output {
  result: UserProps;
  message: string;
}

export function API_User_Login(body: API_User_Login_Input) {
  return httpPost<API_User_Login_Output>("/users/login", body);
}
