import Database from "../../configs/db.config"

export async function getAllSalesService(hotelId: string, take: number, skip: number, search: string) {
  const sales = await Database.client.cashFlow.findMany({
    where: { hotelId, category: "SALES", remarks: { contains: search } },
    include: {
      paymentMethod: {
        select: { name: true }
      }
    },
    orderBy: { createdAt: "desc" },
    take,
    skip,
  })
  return sales
}