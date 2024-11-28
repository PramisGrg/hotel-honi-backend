import { transactionOf } from "@prisma/client";
import { z } from "zod";

export const createTransactionSchema = z.object({
  transactionOf: z.nativeEnum(transactionOf, { message: "Invalid transaction type." }),
  userId: z.string({ message: "User Is required to create transaction." }).min(8, { message: "Please provide a valid UUID." }),
  transactionType: z.enum(["IN", "OUT"], { message: "Invalid transaction type." }),
  isCredit: z.boolean(),
  paymentDetails: z.object({
    paymentMethodId: z.string({ message: "Payment method ID is required." }),
    amount: z.coerce.number({ message: "Please provide the amount that was received from customer." }),
    isChangeMoneyReturned: z.boolean({ message: "Please provide a valid boolean value." }).optional(),
  }),
  remarks: z.string().optional(),
});

export type TCreateTransactionSchema = z.infer<typeof createTransactionSchema>;