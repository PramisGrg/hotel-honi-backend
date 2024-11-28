import { z } from "zod"

export const updateWebsiteSchema = z.object({
  url: z.string({ message: "Url must be a string." }).url({ message: "Please provide a valid url." }).optional(),
  title: z.string({ message: "Title is required." }).min(2, { message: "Please provide a valid title." }).optional(),
  customDomain: z.boolean().optional(),
  description: z.string().min(4, { message: "Please provide a valid description." }).optional()
})

export type TUpdateWebsiteSchema = z.infer<typeof updateWebsiteSchema>
