import { z } from "zod";

export const createPaymentMethodSchema = z.object({
  name: z.string({ message: 'Name of the payment method is required.' }).min(4, { message: 'Please provide a valid name of payment method' }),
  remarks: z.string({ message: 'Please provide valid remarks.' }).optional()
})


export type TCreatePaymentMethodSchema = z.infer<typeof createPaymentMethodSchema>
