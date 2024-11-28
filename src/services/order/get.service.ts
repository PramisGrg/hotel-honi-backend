import { KotStatus, OrderType } from "@prisma/client"
import Database from "../../configs/db.config"
import KnownError from "../../utils/knownError.utils"

export async function getAllOrderService(type: OrderType, status: KotStatus, hotelId: string) {
  const orders = await Database.client.orders.findMany({
    where: {
      hotelId,
      isDeleted: false,
      type,
      status
    },
    include: {
      table: {
        select: {
          id: true,
          name: true,
          space: {
            select: {
              id: true,
              name: true
            }
          }
        }
      },
      kots: {
        include: {
          KotItems: {
            include: {
              item: true
            }
          }
        }
      }
    },
    orderBy: { createdAt: "desc" }
  })

  return orders
}

export async function getSingleOrderService(orderId: string, hotelId: string) {
  const order = await Database.client.kot.findFirst({
    where: {
      id: orderId,
      hotelId
    },
    include: {
      KotItems: {
        include: {
          item: true
        }
      }
    }
  })

  if (!order) {
    throw new KnownError("No order with provided details was found.")
  }

  return order
}
