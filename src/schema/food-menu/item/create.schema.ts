import { z } from "zod"

export const createMenuItemSchema = z.object({
  name: z.string({ message: "Name is required." }).min(2, { message: "Please provide a valid name." }),
  price: z.coerce.number({ message: "Price is required." }).min(1, { message: "Please provide a valid price." }),
  description: z.string().min(1, { message: "Please provide valid description of the dish." }).optional(),
  category: z.string({ message: "Invalid category selected." }).optional()
})

export type TCreateMenuItem = z.infer<typeof createMenuItemSchema>
