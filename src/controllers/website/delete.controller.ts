import { NextFunction, Response } from "express"
import { SecureRequest } from "../../interfaces/general/request.interface"
import KnownError from "../../utils/knownError.utils"
import { deleteWebsiteService } from "../../services/website/delete.service"

export async function deleteWebsiteController(req: SecureRequest, res: Response, next: NextFunction) {
  try {
    if (!req.currentUser || !req.currentUser.id) {
      throw new KnownError("You must be logged in to perform this action", 304)
    }

    if (!req.currentUser.activeHotel) {
      throw new KnownError("Please switch to a hotel to create room.")
    }

    const { websiteId } = req.params

    const response = await deleteWebsiteService(websiteId, req.currentUser.id)

    return res.status(200).json({ message: "Website deleted successfully.", data: response })
  } catch (error) {
    return next(error)
  }
}
