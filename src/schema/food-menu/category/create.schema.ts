import { z } from "zod"

export const createFoodMenuCategorySchema = z.object({
  name: z.string({ message: "Name is required." }).min(2, { message: "Please provide valid name." })
})

export type TCreateFoodCategory = z.infer<typeof createFoodMenuCategorySchema>
