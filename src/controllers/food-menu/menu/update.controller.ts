import type { Response, NextFunction } from "express"
import { TUpdateMenuItem } from "../../../schema/food-menu/item/update.schema"
import { SecureRequest } from "../../../interfaces/general/request.interface"
import KnownError from "../../../utils/knownError.utils"
import { updateMenuItemService } from "../../../services/food-menu/item/update.service"

interface IUpdateMenuItemRequest extends SecureRequest {
  body: TUpdateMenuItem
  params: { itemId: string }
}

export async function updateMenuItemController(req: IUpdateMenuItemRequest, res: Response, next: NextFunction) {
  try {
    if (!req.currentUser || !req.currentUser.id) {
      throw new KnownError("You must be logged in to perform this action", 403)
    }
    if (!req.currentUser.activeHotel) {
      throw new KnownError("Please switch to a hotel to perform this action")
    }
    const data = req.body
    const { itemId } = req.params
    const response = await updateMenuItemService(data, itemId, req.imageUrl)

    return res.status(200).json({ message: "Menu item updated successfully.", data: response })
  } catch (error) {
    return next(error)
  }
}
