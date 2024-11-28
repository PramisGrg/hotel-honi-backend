
import { z } from 'zod';
export const updateTableSchema = z.object({
  name: z.string({ message: "Name is required." }).min(2, { message: "Please provide a valid table name." }).optional(),
  capacity: z.number({ message: "Capacity is required." }).optional(),
  spaceId: z.string({ message: "Invalid space selected." }).optional()
})


export type TUpdateTableSchema = z.infer<typeof updateTableSchema>
