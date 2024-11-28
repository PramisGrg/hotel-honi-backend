import { z } from "zod"

export const updateFoodMenuCategorySchema = z.object({
  name: z.string({ message: "Name is required." }).min(2, { message: "Please provide valid name." }).optional()
})

export type TUpdateFoodMenuCategory = z.infer<typeof updateFoodMenuCategorySchema>
