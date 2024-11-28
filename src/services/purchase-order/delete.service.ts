import Database from "../../configs/db.config";

export async function deletePurchaseOrderService(purchaseOrderId: string, _userId: string, hotelId: string) {
  const deletedPurchaseOrder = await Database.client.purchaseOrder.update({
    where: {
      id: purchaseOrderId,
      hotelId: hotelId
    },
    data: {
      isDeleted: true
    }
  });

  if (!deletedPurchaseOrder) {
    throw new Error("Failed to update purchase order");
  }

  return deletedPurchaseOrder;
}