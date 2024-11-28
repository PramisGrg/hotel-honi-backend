import { z } from "zod";

export const updatePurchaseOrderSchema = z.object({

  name: z.string({ message: "Name is required." }).min(3, { message: "Please provide valid name." }).optional(),
  isCustomItem: z.boolean().optional(),
  quantity: z.number({ message: "Quantity is required." }).optional(),
  price: z.number({ message: "Price is required." }),
  inventoryId: z.string().optional(),
  staffId: z.string().optional(),
  supplierId: z.string().optional(),
  remarks: z.string().optional(),
});

export type TUpdatePurchaseOrderSchema = z.infer<typeof updatePurchaseOrderSchema>;
