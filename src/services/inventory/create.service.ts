import Database from "../../configs/db.config"
import { TCreateInventorySchema } from "../../schema/inventory/create.schema"
import KnownError from "../../utils/knownError.utils"

export async function createInventoryService(data: TCreateInventorySchema, hotelId: string, image: string[] | undefined) {
  const createdInventory = await Database.client.inventory.create({
    data: {
      name: data.name,
      quantity: data.quantity,
      unit: data.unit,
      price: data.price,
      image: image ? image[0] : undefined,
      description: data.description,
      hotelId
    }
  })

  if (!createdInventory) throw new KnownError("Failed to create new inventory")

  return createdInventory
}
