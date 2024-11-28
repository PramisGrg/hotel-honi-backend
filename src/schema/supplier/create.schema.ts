import { z } from "zod";
export const createSupplierSchema = z.object({
  name: z.string({ message: "Supplier name is required." }).min(2, { message: "Please provide a valid supplier name." }),
  address: z.string({ message: "Please provide a valid supplier address." }).optional(),
  contactNumber: z.string({ message: "Please provide a valid supplier contact number." }).optional(),
  openingBalance: z.coerce.number({ message: "Please provide a valid opening balance" }).optional(),
  emailAddress: z.string({ message: "Please provide a valid email address." }).email({ message: 'Please provide a valid email address.' }).optional()
})

export type TCreateSupplierSchema = z.infer<typeof createSupplierSchema>
