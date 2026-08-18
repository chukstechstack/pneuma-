import { UseFormRegister, FieldErrors, UseFormHandleSubmit } from "react-hook-form";

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

export interface LoginInputProps {
  register: UseFormRegister<any>;
  errors: FieldErrors<any>;
  handleSubmit: UseFormHandleSubmit<any, any>;
  onSubmit: (data: any) => void;
  isSubmitting?: boolean; // <-- This line tells LoginInput that isSubmitting is allowed
}