import { z } from "zod";

export const createOrderSchema = z.object({
  orderFor: z.enum(['TABLE', 'ROOM']),
  spaceId: z.string({ message: "Space is required to place order." }).min(8, { message: "Please provide a valid UUID." }),
  items: z
    .array(
      z.object({
        itemId: z.string(),
        quantity: z.coerce.number().min(1, { message: "Please add at least 1 quantity." })
      })
    )
})


export type TCreateOrderSchema = z.infer<typeof createOrderSchema>
