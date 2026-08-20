import React, { useState } from "react";
import { type Control, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema } from "@/schemas/auth_Schema";
import { AuthLayout } from "../AuthLayout";
import RegisterInput from "../../components/Register/RegisterInput";
import { useRegisterMutation } from "@/pages/Register/useRegisterMutation";

// 👉 1. Add termsAccepted to your form values type definition
type RegisterFormValues = {
  full_name: string;
  email: string;
  password: string;
  confirmPassword: string;
  termsAccepted: boolean;
};

const RegisterPage: React.FC = () => {
  const [serverError, setServerError] = useState("");
  const { mutate: registerUser, isPending } = useRegisterMutation();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = (data: RegisterFormValues) => {
    setServerError("");

    registerUser(data, {
      onError: (err: any) => {
        const message = err?.response?.data?.error || err?.message || "Failed to create account. Please try again.";
        setServerError(message);
      },
    });
  };

  return (
    <AuthLayout 
      title="" 
      subtitle=""
    >
      {serverError && (
        <div className="mb-6 p-4 rounded-xl bg-red-950/40 border border-red-500/40 text-red-200 text-sm">
          {serverError}
        </div>
      )}

      <RegisterInput
        register={register}
        errors={errors}
        control={control as unknown as Control<any>}
        handleSubmit={handleSubmit}
        onSubmit={onSubmit}
        isSubmitting={isPending}
      >
        {/* 👉 2. Pass the terms checkbox as children or render it inside your form layout */}
        <div className="flex flex-col gap-1.5 my-3">
          <label className="flex items-start gap-3 text-xs text-gray-400 cursor-pointer select-none">
            <input 
              type="checkbox" 
              {...register("termsAccepted")}
              className="mt-0.5 w-4 h-4 rounded border-white/20 bg-black/60 text-[#d4af37] focus:ring-[#d4af37] cursor-pointer"
            />
            <span>
              I agree to the <a href="/terms" target="_blank" className="text-[#d4af37] hover:underline">Terms of Service</a> and <a href="/privacy" target="_blank" className="text-[#d4af37] hover:underline">Privacy Policy</a>.
            </span>
          </label>
          {errors.termsAccepted && (
            <p className="text-[11px] text-red-400 pl-7">
              {errors.termsAccepted.message?.toString()}
            </p>
          )}
        </div>
      </RegisterInput>
    </AuthLayout>
  );
};

export default RegisterPage;