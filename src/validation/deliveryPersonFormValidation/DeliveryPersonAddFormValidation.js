import { z } from 'zod';

export const deliveryPersonSignupFormSchema = z.object({
    delivery_person_user_name: z.string()
    .min(4, 'Username must be at least 4 characters')
    .max(20, 'Username must be at most 20 characters'),

    delivery_person_name: z.string()
    .min(4, 'Name must be at least 4 characters')
    .max(20, 'Name must be at most 20 characters'),

    delivery_person_password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .max(50, 'Password must be at most 50 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),

    delivery_person_nic_no: z.string("NIC number is required").min(10, 'NIC number must be at least 10 characters').max(12, 'NIC number must be at most 12 characters'),

    delivery_person_img: z.any()
    .refine(
      (file) =>
        file instanceof File || (typeof file === "string" && file.length > 0),
      {
        message: "Registration document image is required",
      }
    ),

    confirmPassword: z.string(),

    delivery_org_id: z.number(),
}).refine(data => data.delivery_person_password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});