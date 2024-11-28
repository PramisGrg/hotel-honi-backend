import type { Response, NextFunction } from "express"
import { SecureRequest } from "../../interfaces/general/request.interface"
import KnownError from "../../utils/knownError.utils"
import { getAllInventoryService, getInventoryService } from "../../services/inventory/get.service"

export async function getAllInventoryController(req: SecureRequest, res: Response, next: NextFunction) {
  try {
    if (!req.currentUser || !req.currentUser.id) {
      throw new KnownError("You must be logged in to perform this action", 403)
    }
    if (!req.currentUser.activeHotel) {
      throw new KnownError("Please switch to a hotel to perform this action")
    }
    const response = await getAllInventoryService(
      req.currentUser.activeHotel,
      Number(req.query.take ?? 25),
      Number(req.query.skip ?? 0),
      String(req.query.search ?? "")
    )

    return res.status(200).json({ message: "All inventory fetched successfully.", data: response })
  } catch (error) {
    return next(error)
  }
}

export async function getInventoryController(req: SecureRequest, res: Response, next: NextFunction) {
  try {
    if (!req.currentUser || !req.currentUser.id) {
      throw new KnownError("You must be logged in to perform this action", 403)
    }
    if (!req.currentUser.activeHotel) {
      throw new KnownError("Please switch to a hotel to perform this action")
    }
    const { inventoryId } = req.params

    const response = await getInventoryService(req.currentUser.activeHotel, inventoryId)

    return res.status(200).json({ message: "Inventory details fetched successfully.", data: response })
  } catch (error) {
    return next(error)
  }
}
