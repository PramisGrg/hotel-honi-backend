import { serviceChargeType } from "@prisma/client";
import { z } from "zod";

export const getBillDetailsSchema = z.object({
  orderId: z.string({ message: "OrderId is required" }),
  isCustomBill: z.boolean({ message: "Please provide a valid boolean value." }).optional(),
  serviceCharge: z.string({ message: "Service charge must be a string." }).optional(),
  serviceChargeType: z.nativeEnum(serviceChargeType, { message: 'Please provide a valid service charge type.' }).optional(),
  discount: z.string({ message: "Discount must be a string." }).optional(),
  discountType: z.nativeEnum(serviceChargeType, { message: 'Please provide a valid discount type.' }).optional(),
})

export type TGetBillDetailsSchema = z.infer<typeof getBillDetailsSchema>
