import { z } from "zod"

export const createWebsiteSchema = z.object({
  url: z.string({ message: "Website URL is required." }).url({ message: "Please provide a valid url." }),
  title: z.string({ message: "Title is required." }).min(2, { message: "Please provide a valid title." }),
  customDomain: z.boolean().optional(),
  description: z.string().min(4, { message: "Please provide a valid description." }).optional(),
})

export type TCreateWebsiteSchema = z.infer<typeof createWebsiteSchema>
