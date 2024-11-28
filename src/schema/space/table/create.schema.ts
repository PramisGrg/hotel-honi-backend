import { z } from "zod"
export const createTableSchema = z.object({
  name: z.string({ message: "Name is required." }).min(2, { message: "Please provide a valid table name." }),
  capacity: z.coerce.number({ message: "Capacity is required." }),
  spaceId: z.string({ message: "Invalid space selected." }).optional()
})

export type TCreateTableSchema = z.infer<typeof createTableSchema>
