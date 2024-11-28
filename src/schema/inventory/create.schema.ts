import z from "zod"

export const createInventorySchema = z.object({
  name: z.string({ message: "Name is required." }).min(2, { message: "Please provide valid name." }),
  quantity: z.coerce.number({ message: "Please provide valid quantity." }),
  price: z.coerce.number({ message: "Please provide valid price." }),
  unit: z.string({ message: "Unit is required." }),
  description: z.string().min(2, { message: "Please provide valid description." }).optional()
})

export type TCreateInventorySchema = z.infer<typeof createInventorySchema>
