import { z } from 'zod';

export const createRoomSchema = z.object({
  name: z.string({ message: "Room name is required." }).min(1, { message: "Room name is invalid." }),
  price: z.string({ message: "Room price is required." }).min(1, { message: "Room price is required." }),
  spaceId: z.string({ message: "Invalid space selected." }).optional(),
  capacity: z.coerce.number({ message: "Please provide valid room capacity." }),
  description: z.string({ message: "Description must be valid." }).optional()
})

export type TCreateRoomSchema = z.infer<typeof createRoomSchema>
