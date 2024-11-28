import z from "zod"

export const updateInventorySchema = z.object({
  name: z.string({ message: "Name is required." }).min(2, { message: "Please provide valid name." }).optional(),
  quantity: z.coerce.number({ message: "Please provide valid quantity." }).optional(),
  unit: z.string({ message: "Unit is required." }).optional(),
  price: z.coerce.number({ message: "Please provide valid price." }).optional(),
  description: z.string().min(2, { message: "Please provide valid description." }).optional()
})

export type TUpdateInventorySchema = z.infer<typeof updateInventorySchema>
