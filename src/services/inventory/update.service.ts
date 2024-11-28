import Database from "../../configs/db.config"
import { TUpdateInventorySchema } from "../../schema/inventory/update.schema"
import KnownError from "../../utils/knownError.utils"

export async function updateInventoryService(
  data: TUpdateInventorySchema,
  hotelId: string,
  inventoryId: string,
  _userId: string,
  image: string[] | undefined
) {
  const updatedInventory = await Database.client.inventory.update({
    where: {
      id: inventoryId
    },
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

  if (!updatedInventory) throw new KnownError("Failed to update inventory")
  //to do: activity log update inventory
  return updatedInventory
}
