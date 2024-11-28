import Database from "../../configs/db.config"
import KnownError from "../../utils/knownError.utils"

export async function deleteInventoryService(inventoryId: string, hotelId: string, _userId: string) {
  const deletedInventory = await Database.client.inventory.delete({
    where: {
      id: inventoryId,
      hotelId
    }
  })

  if (!deletedInventory) throw new KnownError("Failed to update inventory")
  //to do: activity log delete inventory
  return deletedInventory
}
