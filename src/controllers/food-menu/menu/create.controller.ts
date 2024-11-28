import type { Response, NextFunction } from "express"
import { TCreateMenuItem } from "../../../schema/food-menu/item/create.schema"
import { SecureRequest } from "../../../interfaces/general/request.interface"
import KnownError from "../../../utils/knownError.utils"
import { createMenuItemService } from "../../../services/food-menu/item/create.service"

interface ICreateMenuItemRequest extends SecureRequest {
  body: TCreateMenuItem
}

export async function createMenuItemController(req: ICreateMenuItemRequest, res: Response, next: NextFunction) {
  try {
    if (!req.currentUser || !req.currentUser.id) {
      throw new KnownError("You must be logged in to perform this action", 403)
    }
    if (!req.currentUser.activeHotel) {
      throw new KnownError("Please switch to a hotel to perform this action")
    }
    const data = req.body
    const response = await createMenuItemService(data, req.currentUser.activeHotel, req.currentUser.id, req.imageUrl)
    return res.status(200).json({ message: "Food Menu created successfully", data: response })
  } catch (error) {
    return next(error)
  }
}
