import { KotStatus } from "@prisma/client";
import { z } from "zod";

export const updateKotItemSchema = z.object({
  quantity: z.coerce.number({ message: "Please provide valid quantity." }).optional(),
  status: z.nativeEnum(KotStatus, { message: "Invalid Kot Status" }).optional()
})

export type TUpdateKotItemSchema = z.infer<typeof updateKotItemSchema>