import { PrinterType } from "@prisma/client";
import { z } from "zod";

export const updatePrinterSchema = z.object({
  name: z.string({ message: "Name is required." }).min(2, { message: "Name must be at least 2 characters long." }).optional(),
  ipAddress: z.string({ message: "IP address is required." }).min(4, { message: "Please provide a valid IP address." }).optional(),
  nickName: z.string({ message: "Please provide a valid nickname." }).optional(),
  type: z.enum([PrinterType.NETWORK, PrinterType.BLUETOOTH]).optional()
})


export type TUpdatePrinterSchema = z.infer<typeof updatePrinterSchema>
