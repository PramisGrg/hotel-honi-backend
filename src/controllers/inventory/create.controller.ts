import type { Response, NextFunction } from "express"
import { TCreateInventorySchema } from "../../schema/inventory/create.schema"
import { createInventoryService } from "../../services/inventory/create.service"
import { SecureRequest } from "../../interfaces/general/request.interface"
import KnownError from "../../utils/knownError.utils"

interface ICreateInventoryRequest extends SecureRequest {
  body: TCreateInventorySchema
}
export async function createInventoryController(req: ICreateInventoryRequest, res: Response, next: NextFunction) {
  try {
    if (!req.currentUser || !req.currentUser.id) {
      throw new KnownError("You must be logged in to perform this action", 403)
    }
    if (!req.currentUser.activeHotel) {
      throw new KnownError("Please switch to a hotel to perform this action")
    }

    const response = await createInventoryService(req.body, req.currentUser.activeHotel, req.imageUrl)

    return res.status(200).json({ message: "Inventory created successfully.", data: response })
  } catch (error) {
    return next(error)
  }
}
