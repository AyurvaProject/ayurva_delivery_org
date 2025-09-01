import { z } from 'zod';

export const signupFormSchema = z.object({
    user_name: z.string()
    .min(4, 'Username must be at least 4 characters')
    .max(20, 'Username must be at most 20 characters'),

    password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .max(50, 'Password must be at most 50 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),

    delivery_org_name: z.string()
    .min(1, 'Delivery organization is required')
    .max(50, 'Delivery organization name must be at most 50 characters'),

    delivery_org_register_document: z.any()
    .refine(
      (file) =>
        file instanceof File || (typeof file === "string" && file.length > 0),
      {
        message: "Registration document image is required",
      }
    ),

    confirmPassword: z.string(),

    ayurva_admin_id: z.number(),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});