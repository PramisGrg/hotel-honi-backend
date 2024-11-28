import Database from "../../configs/db.config"
import KnownError from "../../utils/knownError.utils"

export async function getInventoryService(hotelId: string, inventoryId: string) {
  const existingInventory = await Database.client.inventory.findFirst({
    where: {
      hotelId,
      id: inventoryId
    }
  })

  if (!existingInventory) throw new KnownError("Failed to fetch inventory")

  return existingInventory
}

export async function getAllInventoryService(hotelId: string, take: number, skip: number, search: string | undefined) {
  const existingInventory = await Database.client.inventory.findMany({
    where: {
      hotelId,
      name: { contains: search ?? undefined }
    },
    take,
    skip,
    orderBy: { createdAt: "desc" }
  })

  if (!existingInventory) throw new KnownError("Failed to fetch inventory")

  return existingInventory
}
