import Database from "../../configs/db.config";
import { TUpdatePurchaseOrderSchema } from "../../schema/purchase-order/update.schema";

export async function updatePurchaseOrderService(data: TUpdatePurchaseOrderSchema, purchaseOrderId: string, _userId: string, hotelId: string) {
  const updatedPurchaseOrder = await Database.client.purchaseOrder.update({
    where: {
      id: purchaseOrderId
    },
    data: {
      name: data.name,
      isCustomItem: data.isCustomItem,
      quantity: data.quantity,
      price: data.price,
      inventoryId: data.inventoryId,
      staffId: data.staffId,
      supplierId: data.supplierId,
      remarks: data.remarks,
      hotelId: hotelId
    }
  });

  if (!updatedPurchaseOrder) {
    throw new Error("Failed to update purchase order");
  }

  return updatedPurchaseOrder;
}