import { KotStatus } from "@prisma/client";
import Database from "../../../configs/db.config";
import { TUpdateKotItemSchema } from "../../../schema/order/kot/create.schema";
import KnownError from "../../../utils/knownError.utils";

export async function updateKotItemService(data: TUpdateKotItemSchema, kotId: string, kotItemId: string, orderId: string) {

  const updatedKotFoodMenuItem = await Database.client.kotItems.update({
    where: {
      id: kotItemId,
      kotId
    },
    data: {
      quantity: data.quantity,
      status: data.status
    }
  });

  if (!updatedKotFoodMenuItem) {
    throw new KnownError('No such item was found on KOT to update.', 404);
  }

  //check if all the items are served to change the status of KOT

  const notServedItems = await Database.client.kotItems.findMany({
    where: {
      kotId,
      status: {
        notIn: [KotStatus.SERVED, KotStatus.CANCELLED]
      }
    }
  })

  if (notServedItems.length == 0) {
    await Database.client.kot.update({ where: { id: kotId }, data: { status: KotStatus.SERVED } });
  }

  // check if all the KOT are served to change the status of order
  const notServedKots = await Database.client.kot.findMany({
    where: {
      ordersId: orderId,
      status: {
        notIn: [KotStatus.SERVED, KotStatus.CANCELLED]
      }
    }
  })

  if (notServedKots.length == 0) {
    await Database.client.orders.update({ where: { id: orderId }, data: { status: "SERVED" } });
  }

  return updatedKotFoodMenuItem;
}