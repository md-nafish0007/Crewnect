import { z } from 'zod';

export const emailSchema = z
  .string()
  .min(1, "Email is required.")
  .email("Invalid email format.")
  .endsWith("@delhitechnicalcampus.ac.in", "Only @delhitechnicalcampus.ac.in email addresses are allowed.");

export const passwordSchema = z.string().min(6, "Password must be at least 6 characters.");

// OTP verification schema
export const sendOtpSchema = z.object({
  email: emailSchema,
});

// Login schema
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Password is required."),
});

// Full registration schema
export const registerSchema = z.object({
  name: z.string().min(1, "Name is required."),
  email: emailSchema,
  password: passwordSchema,
  gender: z.enum(["Male", "Female"]),
  major: z.string().min(1, "Major is required."),
  year: z.string().min(1, "Year is required."),
  techStacks: z.array(z.string()).default([]),
  bio: z.string().optional(),
  otp: z.string().length(6, "OTP must be exactly 6 digits."),
});
