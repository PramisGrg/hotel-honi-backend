import type { Response, NextFunction } from "express"
import { SecureRequest } from "../../interfaces/general/request.interface"
import { TUpdateInventorySchema } from "../../schema/inventory/update.schema"
import KnownError from "../../utils/knownError.utils"
import { updateInventoryService } from "../../services/inventory/update.service"

interface IUpdateInventoryRequest extends SecureRequest {
  body: TUpdateInventorySchema
}
export async function updateInventoryController(req: IUpdateInventoryRequest, res: Response, next: NextFunction) {
  try {
    if (!req.currentUser || !req.currentUser.id) {
      throw new KnownError("You must be logged in to perform this action", 403)
    }
    if (!req.currentUser.activeHotel) {
      throw new KnownError("Please switch to a hotel to perform this action")
    }
    const { inventoryId } = req.params
    const response = await updateInventoryService(
      req.body,
      req.currentUser.activeHotel,
      inventoryId,
      req.currentUser.id,
      req.imageUrl
    )

    return res.status(200).json({ message: "Inventory updated successfully.", data: response })
  } catch (error) {
    return next(error)
  }
}
