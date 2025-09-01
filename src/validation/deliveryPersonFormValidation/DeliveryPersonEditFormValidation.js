import { z } from 'zod';

export const deliveryPersonEditFormSchema = z.object({
    delivery_person_user_name: z.string()
    .min(4, 'Username must be at least 4 characters')
    .max(20, 'Username must be at most 20 characters'),

    delivery_person_name: z.string()
    .min(4, 'Name must be at least 4 characters')
    .max(20, 'Name must be at most 20 characters'),

    delivery_person_nic_no: z.string("NIC number is required").min(10, 'NIC number must be at least 10 characters').max(12, 'NIC number must be at most 12 characters'),

    delivery_person_img: z.any()
    .refine(
      (file) =>
        file instanceof File || (typeof file === "string" && file.length > 0),
      {
        message: "Profile image is required",
      }
    ),

    delivery_org_id: z.number(),
})