import { z } from "zod"

export const updatePaymentMethodSchema = z.object({
  name: z.string({ message: 'Name of the payment method is required.' }).min(4, { message: 'Please provide a valid name of payment method' }).optional(),
  remarks: z.string({ message: 'Please provide valid remarks.' }).optional()
})


export type TUpdatePaymentMethodSchema = z.infer<typeof updatePaymentMethodSchema>
