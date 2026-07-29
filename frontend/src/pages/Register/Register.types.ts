export interface RegisterFormValues {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export type RegisterPayload = Omit<RegisterFormValues, "confirmPassword">;

export interface RegisteredUser {
  id: string;
  uuid: string;
}

export interface RegisterResponseData {
  user: RegisteredUser;
}

export interface RegisterMutationResponse {
  data: RegisterResponseData;
}