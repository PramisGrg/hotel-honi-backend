import { z } from "zod"

export const updateMenuItemSchema = z.object({
  name: z.string({ message: "Name is required." }).min(2, { message: "Please provide a valid name." }).optional(),
  price: z.coerce.number({ message: "Price is required." }).min(1, { message: "Please provide a valid price." }).optional(),
  description: z.string().min(1, { message: "Please provide valid description of the dish." }).optional(),
  category: z.string().optional()
})

export type TUpdateMenuItem = z.infer<typeof updateMenuItemSchema>
