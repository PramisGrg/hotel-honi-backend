import Database from "../../../configs/db.config";

export async function getKotService(hotelId: string, kotId: string) {
  const kot = await Database.client.kot.findFirst({ where: { id: kotId, hotelId } })
  return kot;
}

export async function getAllKotService(hotelId: string, orderId: string) {

  const orders = await Database.client.kot.findMany({
    where: {
      hotelId,
      ordersId: orderId,
    },
    include: {
      KotItems: {
        include: {
          item: {
            select: {
              id: true,
              name: true,
              price: true,
              image: true
            }
          }
        }
      }
    },
    orderBy: { createdAt: "desc" }
  })
  return orders
}