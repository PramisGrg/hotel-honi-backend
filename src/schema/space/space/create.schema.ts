import { z } from "zod";

export const createSpaceSchema = z.object({
  name: z.string({ message: "Space name is required." })
})


export type TCreateSpaceSchema = z.infer<typeof createSpaceSchema>
