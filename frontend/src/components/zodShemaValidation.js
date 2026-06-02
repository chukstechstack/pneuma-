import * as zod  from "zod";

// 🌟 EXPORT THE SCHEMA CLEANLY
export const registerSchema = zod
  .object({
    first_name: zod.string().min(2, "First name must be at least 2 characters"),
    last_name: zod.string().min(2, "Last name must be at least 2 characters"),
    email: zod.string().email("Please enter a valid email address"),
    password: zod
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
    confirmPassword: zod.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"], 
  });


  export const loginSchema = zod.object({
  email: zod
    .string()
    .min(1, "Email address is required")
    .email("Please enter a valid email address"),
  password: zod
    .string()
    .min(1, "Password is required"),
});