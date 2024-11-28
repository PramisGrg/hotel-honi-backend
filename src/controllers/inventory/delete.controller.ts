import type { Response, NextFunction } from "express"
import { SecureRequest } from "../../interfaces/general/request.interface"
import KnownError from "../../utils/knownError.utils"
import { deleteInventoryService } from "../../services/inventory/delete.service"

export async function deleteInventoryController(req: SecureRequest, res: Response, next: NextFunction) {
  try {
    if (!req.currentUser || !req.currentUser.id) {
      throw new KnownError("You must be logged in to perform this action", 403)
    }
    if (!req.currentUser.activeHotel) {
      throw new KnownError("Please switch to a hotel to perform this action")
    }
    const { inventoryId } = req.params
    const response = await deleteInventoryService(inventoryId, req.currentUser.activeHotel, req.currentUser.id)

    return res.status(200).json({ message: "Inventory deleted successfully.", data: response })
  } catch (error) {
    return next(error)
  }
}
