import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "@/schemas/auth_Schema";
import { AuthLayout } from "../AuthLayout";
import LoginInput from "../../components/Login/LoginInput";
import { useLoginMutation } from "@/pages/Login/useLoginMutation";
import type { LoginFormValues } from "./Login.types";

const LoginPage: React.FC = () => {
  const [serverError, setServerError] = useState("");
  const { mutate: loginUser, isPending } = useLoginMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginFormValues) => {
    setServerError("");
    
    loginUser(data, {
      onError: (err: any) => {
        const message = err?.response?.data?.error || err?.message || "Invalid email or password. Please try again.";
        setServerError(message);
      },
    });
  };

  return (
    <AuthLayout 
      title="Welcome Back" 
      subtitle="Sign in to continue recording your daily diary and legacy."
    >
      {serverError && (
        <div className="mb-6 p-4 rounded-xl bg-red-950/40 border border-red-500/40 text-red-200 text-sm">
          {serverError}
        </div>
      )}

      <LoginInput
        register={register}
        errors={errors}
        handleSubmit={handleSubmit}
        onSubmit={onSubmit}
        isSubmitting={isPending}
      />
    </AuthLayout>
  );
};

export default LoginPage;