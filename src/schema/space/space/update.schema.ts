
import { z } from "zod";

export const updateSpaceSchema = z.object({
  name: z.string({ message: "Space name is required." }).optional()
})


export type TUpdateSpaceSchema = z.infer<typeof updateSpaceSchema>
