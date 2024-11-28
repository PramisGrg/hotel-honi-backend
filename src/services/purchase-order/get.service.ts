import Database from "../../configs/db.config";
import KnownError from "../../utils/knownError.utils";

export async function getAllPurchaseOrderService(hotelId: string) {
  const existingPurchaseOrders = await Database.client.purchaseOrder.findMany({
    where: {
      hotelId
    },
    select: {
      id: true,
      name: true,
      isCustomItem: true,
      quantity: true,
      price: true,
      isDeleted: true,
      staff: {
        select: { id: true, name: true }
      },
      supplier: {
        select: { id: true, name: true }
      },
      inventory: {
        select: { id: true, name: true }
      },
      createdAt: true,
      updatedAt: true,
    }
  });
  return existingPurchaseOrders;
}

export async function getPurchaseOrderService(purchaseOrderId: string, hotelId: string) {
  const existingPurchaseOrder = await Database.client.purchaseOrder.findFirst({
    where: {
      id: purchaseOrderId,
      hotelId
    },
    select: {
      id: true,
      name: true,
      isCustomItem: true,
      quantity: true,
      price: true,
      isDeleted: true,
      staff: {
        select: { id: true, name: true }
      },
      supplier: {
        select: { id: true, name: true }
      },
      createdAt: true,
      updatedAt: true,
    }
  });
  if (!existingPurchaseOrder) {
    throw new KnownError("Purchase Order not found", 404);
  }
  return existingPurchaseOrder;
}