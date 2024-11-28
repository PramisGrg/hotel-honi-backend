import { NextFunction, Response } from "express"
import { SecureRequest } from "../../interfaces/general/request.interface"
import { TUpdateWebsiteSchema } from "../../schema/website/update.schema"
import KnownError from "../../utils/knownError.utils"
import { updateWebsiteService } from "../../services/website/update.service"

interface TUpdateWebsiteRequest extends SecureRequest {
  body: TUpdateWebsiteSchema
}

export async function updateWebsiteController(req: TUpdateWebsiteRequest, res: Response, next: NextFunction) {
  try {
    if (!req.currentUser || !req.currentUser.id) {
      throw new KnownError("You must be logged in to perform this action", 304)
    }

    if (!req.currentUser.activeHotel) {
      throw new KnownError("Please switch to a hotel to create room.")
    }

    const { websiteId } = req.params

    const response = await updateWebsiteService(req.body, websiteId, req.currentUser.id)

    return res.status(200).json({ message: "Website updated successfully.", data: response })
  } catch (error) {
    return next(error)
  }
}
