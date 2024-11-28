import { z } from "zod"

export const createCustomerSchema = z.object({
  name: z.string({ message: "Customer name is required." }).min(2, { message: "Please provide a valid customer name." }),
  address: z.string({ message: "Please provide a valid customer address." }).optional(),
  contactNumber: z.string({ message: "Please provide a valid customer contact number." }).optional(),
  openingBalance: z.coerce.number({ message: "Please provide a valid opening balance." }).optional(),
  emailAddress: z.string({ message: "Please provide a valid email address." }).email({ message: 'Please provide a valid email address.' }).optional()
})

export type TCreateCustomerSchema = z.infer<typeof createCustomerSchema>
