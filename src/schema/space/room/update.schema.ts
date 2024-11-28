import { z } from 'zod';

export const updateRoomSchema = z.object({
  name: z.string({ message: "Room name is required." }).min(1, { message: "Room name is invalid." }).optional(),
  price: z.string({ message: "Room price is required." }).min(1, { message: "Room price is required." }).optional(),
  spaceId: z.string({ message: "Invalid space selected." }).optional(),
  capacity: z.coerce.number({ message: "Please provide valid room capacity." }).optional(),
})

export type TUpdateRoomSchema = z.infer<typeof updateRoomSchema>
