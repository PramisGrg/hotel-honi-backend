import { KotStatus } from "@prisma/client"
import Database from "../../configs/db.config"
import { TCreateOrderSchema } from "../../schema/order/create.schema"
import KnownError from "../../utils/knownError.utils";
import { isDuplicateInArray } from "../../utils/duplicateArray.utils";

export async function createOrderService(data: TCreateOrderSchema, userId: string, hotelId: string) {


  let existingOrder;
  // check if order is placed for the table or room already.
  if (data.orderFor == "ROOM") {
    existingOrder = await Database.client.orders.findFirst({ where: { roomId: data.spaceId, isDeleted: false, status: { notIn: ["CANCELLED"] } } });
  } else if (data.orderFor == "TABLE") {
    existingOrder = await Database.client.orders.findFirst({ where: { tableId: data.spaceId, isDeleted: false, status: { notIn: ["CANCELLED"] } } });
  }


  // check if any item is repeated.
  const isDuplicateItem = isDuplicateInArray(data.items);
  if (isDuplicateItem) {
    throw new KnownError('Duplicate items detected, please do not duplicate instead increase the quantity of previous item.');
  }

  const items = data.items.map((item) => ({
    id: item.itemId,
    quantity: item.quantity
  }))

  const totalHotelKot = await Database.client.kot.count({ where: { hotelId } })

  const createdKot = await Database.client.kot.create({
    data: {
      hotelId,
      userId,
      type: data.orderFor,
      kotNumber: String(totalHotelKot + 1),
      KotItems: {
        createMany: {
          data: items.map((item) => {
            return {
              foodMenuItemId: item.id,
              quantity: item.quantity,
              status: KotStatus.PENDING
            }
          })
        }
      },
      status: KotStatus.PENDING,
      orderForId: data.spaceId
    }
  });

  const totalHotelOrderCount = await Database.client.orders.count({ where: { hotelId } })

  if (existingOrder) {
    existingOrder = await Database.client.orders.update({ where: { id: existingOrder.id }, data: { status: KotStatus.PENDING, kots: { connect: { id: createdKot.id } } } });
  } else {
    existingOrder = await Database.client.orders.create({
      data: {
        tableId: data.orderFor === "TABLE" ? data.spaceId : undefined,
        roomId: data.orderFor === "ROOM" ? data.spaceId : undefined,
        type: data.orderFor,
        kots: { connect: { id: createdKot.id } },
        orderNumber: String(totalHotelOrderCount + 1),
        hotelId,
        status: "PENDING"
      }
    });
  }

  if (data.orderFor === "TABLE") {
    await Database.client.table.update({ where: { id: data.spaceId }, data: { status: "OCCUPIED" } })
  }

  //todo: send notification to kitchen user and print KOT on kitchen printer

  return existingOrder
}
