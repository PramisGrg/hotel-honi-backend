import { Response, NextFunction } from "express"
import { SecureRequest } from "../../../interfaces/general/request.interface"
import KnownError from "../../../utils/knownError.utils"
import { deleteMenuItemService } from "../../../services/food-menu/item/delete.service"

interface deleteMenuItemRequest extends SecureRequest {
  params: { itemId: string }
}

export async function deleteMenuItemController(req: deleteMenuItemRequest, res: Response, next: NextFunction) {
  try {
    if (!req.currentUser || !req.currentUser.id) {
      throw new KnownError("You must be logged in to perform this action", 403)
    }
    if (!req.currentUser.activeHotel) {
      throw new KnownError("Please switch to a hotel to perform this action")
    }
    const { itemId } = req.params
    const response = await deleteMenuItemService(itemId, req.currentUser.id)
    return res.status(200).json({ message: "Food menu delete successfully.", data: response })
  } catch (error) {
    return next(error)
  }
}
