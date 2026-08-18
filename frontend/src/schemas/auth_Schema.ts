import * as zod from "zod";

export const registerSchema = zod
  .object({
    full_name: zod.string().min(2, "Full name must be at least 2 characters"),
    email: zod.string().trim().email("Please enter a valid email address"),
    password: zod
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
    confirmPassword: zod.string(),
    // 👉 Bulletproof checkbox validation using refine
    termsAccepted: zod.boolean().refine((val) => val === true, {
      message: "You must accept the Terms and Privacy Policy",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const loginSchema = zod.object({
  email: zod.string().trim().email("Please enter a valid email address"),
  password: zod.string().min(1, "Password is required"),
  rememberDevice: zod.boolean().optional(),
});