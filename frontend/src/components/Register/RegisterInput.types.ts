import { Control, FieldErrors, UseFormHandleSubmit, UseFormRegister } from "react-hook-form";

export interface RegisterInputProps {
  register: UseFormRegister<any>;
  errors: FieldErrors<any>;
  control: Control<any>;
  handleSubmit: UseFormHandleSubmit<any>;
  onSubmit: (data: any) => void;
}