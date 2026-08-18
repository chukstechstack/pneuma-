import React, { ReactNode } from "react";
import { UseFormRegister, FieldErrors, Control, UseFormHandleSubmit } from "react-hook-form";

export interface RegisterInputProps {
  register: UseFormRegister<any>;
  errors: FieldErrors<any>;
  control: Control<any>;
  handleSubmit: UseFormHandleSubmit<any>;
  onSubmit: (data: any) => void;
  isSubmitting: boolean;
  children?: ReactNode; // 👉 Add this to allow passing the checkbox component inside
}
