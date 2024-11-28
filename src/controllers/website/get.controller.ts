import { Response, NextFunction } from "express"
import { SecureRequest } from "../../interfaces/general/request.interface"
import KnownError from "../../utils/knownError.utils"
import { getWebsiteService } from "../../services/website/get.service"

export async function getWebsiteController(req: SecureRequest, res: Response, next: NextFunction) {
  try {
    if (!req.currentUser || !req.currentUser.id) {
      throw new KnownError("You must be logged in to perform this action", 304)
    }

    if (!req.currentUser.activeHotel) {
      throw new KnownError("Please switch to a hotel to create room.")
    }

    const response = await getWebsiteService(req.currentUser.activeHotel, req.currentUser.id)

    return res.status(200).json({ message: "Websites fetched successfully.", data: response })
  } catch (error) {
    return next(error)
  }
}
