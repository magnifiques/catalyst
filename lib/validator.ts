import { z } from "zod";

export const authFormSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters long"),
  description: z
    .string()
    .min(3, "Description must be at least 3 characters long")
    .max(400, "Description is too long (max: 400 characters"),
  location: z
    .string()
    .min(3, "Location must be at least 3 characters long")
    .max(400, "Location is too long (max: 400 characters"),
  imageUrl: z.string(),
  startDateTime: z.date(),
  endDataTime: z.date(),
  categoryId: z.string(),
  price: z.string(),
  isFree: z.boolean(),
  url: z.string().url(),
});
