import { serviceChargeType } from "@prisma/client";
import { z } from "zod";

export const checkoutOrderSchema = z.object({
  orderId: z.string({ message: "OrderId is required." }),
  paymentDetails: z.object({
    paymentMethodId: z.string({ message: "Payment method ID is required." }),
    amount: z.coerce.number({ message: "Please provide the amount that was received from customer." }),
    isChangeMoneyReturned: z.boolean({ message: "Please provide a valid boolean value." }).optional(),
  }),
  isCustomBill: z.boolean({ message: "Please provide a valid boolean value." }).optional(),
  serviceCharge: z.string({ message: "Service charge must be a string." }).optional(),
  serviceChargeType: z.nativeEnum(serviceChargeType, { message: 'Please provide a valid service charge type.' }).optional(),
  discount: z.string({ message: "Discount must be a string." }).optional(),
  discountType: z.nativeEnum(serviceChargeType, { message: 'Please provide a valid discount type.' }).optional(),
  customerId: z.string({ message: "Customer id must be a string." }).optional(),
  staffId: z.string({ message: "Staff Id must be a string." }).optional(),
  remarks: z.string({ message: "Remarks must be a string." }).optional()
})

export type TCheckoutOrderSchema = z.infer<typeof checkoutOrderSchema>
