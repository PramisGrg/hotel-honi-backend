import { PurchaseOrderStatus } from "@prisma/client";
import Database from "../../configs/db.config";
import { TCreatePurchaseOrderSchema } from "../../schema/purchase-order/create.schema";
import KnownError from "../../utils/knownError.utils";

export async function createPurchaseOrderService(data: TCreatePurchaseOrderSchema, _userId: string, hotelId: string) {

  if (!data.isCustomItem && data.inventoryId) {
    const existingInventory = await Database.client.inventory.findFirst({
      where: {
        id: data.inventoryId
      }
    });

    if (!existingInventory) {
      throw new KnownError("Inventory not found");
    }

    const createdPurchaseOrder = await Database.client.purchaseOrder.create({
      data: {
        name: existingInventory.name,
        isCustomItem: true,
        quantity: data.quantity,
        price: existingInventory.price,
        inventoryId: data.inventoryId,
        staffId: data.staffId,
        supplierId: data.supplierId,
        remarks: data.remarks,
        hotelId: hotelId,
        status: PurchaseOrderStatus.PENDING
      }
    });
    return createdPurchaseOrder
  }

  const createdPurchaseOrder = await Database.client.purchaseOrder.create({
    data: {
      name: data.name || "",
      isCustomItem: data.isCustomItem,
      quantity: data.quantity,
      price: data.price || 0,
      inventoryId: data.inventoryId,
      staffId: data.staffId,
      supplierId: data.supplierId,
      remarks: data.remarks,
      hotelId: hotelId,
      status: PurchaseOrderStatus.PENDING
    }
  });

  if (!createdPurchaseOrder) {
    throw new Error("Failed to create purchase order");
  }

  return createdPurchaseOrder;
}