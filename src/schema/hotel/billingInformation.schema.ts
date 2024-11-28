import { serviceChargeType } from "@prisma/client";
import { z } from "zod";

export const createBillingInformationSchema = z.object({
  taxRate: z.number({ message: 'Tax rate must be in number.' }).min(0, { message: 'Percentage can not be less than 0' }).max(100, { message: 'Percentage can not be greater than 100' }),
  serviceCharge: z.number({ message: 'Please provide a valid service charge.' }).min(0, {
    message: 'Service charge can not be less than 0'
  }),
  serviceChargeType: z.nativeEnum(serviceChargeType, { message: 'Please provide a valid service charge type.' }),
})

export const updateBillingInformationSchema = z.object({
  taxRate: z.number({ message: 'Tax rate must be in number.' }).min(0, { message: 'Percentage can not be less than 0' }).max(100, { message: 'Percentage can not be greater than 100' }).optional(),
  serviceCharge: z.number({ message: 'Please provide a valid service charge.' }).min(0, {
    message: 'Service charge can not be less than 0'
  }).optional(),
  serviceChargeType: z.nativeEnum(serviceChargeType, { message: 'Please provide a valid service charge type.' }).optional()
})

export type TCreateBillingInformationSchema = z.infer<typeof createBillingInformationSchema>;
export type TUpdateBillingInformationSchema = z.infer<typeof updateBillingInformationSchema>;