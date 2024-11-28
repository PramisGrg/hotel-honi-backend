import type { Response, NextFunction } from "express"
import { SecureRequest } from "../../../interfaces/general/request.interface"
import KnownError from "../../../utils/knownError.utils"
import { getMenuItemService, getSingleMenuItemService } from "../../../services/food-menu/item/get.service"

export async function getSingleMenuItemController(req: SecureRequest, res: Response, next: NextFunction) {
  try {
    if (!req.currentUser || !req.currentUser.id) {
      throw new KnownError("You must be logged in to perform this action", 403)
    }
    if (!req.currentUser.activeHotel) {
      throw new KnownError("Please switch to a hotel to perform this action")
    }
    const { itemId } = req.params
    const response = await getSingleMenuItemService(itemId, req.currentUser.activeHotel)
    return res.status(200).json({ message: "Single menu item fetched successfully.", data: response })
  } catch (error) {
    return next(error)
  }
}

export async function getAllMenuItemController(req: SecureRequest, res: Response, next: NextFunction) {
  try {
    if (!req.currentUser || !req.currentUser.id) {
      throw new KnownError("You must be logged in to perform this action", 403)
    }
    if (!req.currentUser.activeHotel) {
      throw new KnownError("Please switch to a hotel to perform this action")
    }
    const response = await getMenuItemService(
      req.currentUser.activeHotel,
      Number(req.query.take ?? 25),
      Number(req.query.skip ?? 0),
      String(req.query.search ?? "")
    )
    return res.status(200).json({ message: "Menu data fetched successfully.", data: response })
  } catch (error) {
    return next(error)
  }
}
