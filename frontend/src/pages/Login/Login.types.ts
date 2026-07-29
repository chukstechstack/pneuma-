export interface LoginFormValues {
  email: string;
  password: string;
}

export interface LoggedInUser {
  id: string;
  uuid: string;
}

export interface LoginResponseData {
  user?: LoggedInUser;
  id?: string;
  uuid?: string;
}

export interface LoginMutationResponse {
  data: LoginResponseData;
}