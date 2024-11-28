import { NextFunction, Response } from "express"
import { SecureRequest } from "../../interfaces/general/request.interface"
import { createWebsiteService } from "../../services/website/create.service"
import { TCreateWebsiteSchema } from "../../schema/website/create.schema"
import KnownError from "../../utils/knownError.utils"

interface TCreateWebsiteRequest extends SecureRequest {
  body: TCreateWebsiteSchema
}

export async function createWebsiteController(req: TCreateWebsiteRequest, res: Response, next: NextFunction) {
  try {
    if (!req.currentUser || !req.currentUser.id) {
      throw new KnownError("You must be logged in to perform this action", 304)
    }

    if (!req.currentUser.activeHotel) {
      throw new KnownError("Please switch to a hotel to create room.")
    }

    const response = await createWebsiteService(req.body, req.currentUser.activeHotel, req.currentUser.id)

    return res.status(200).json({ message: "Website created successfully.", data: response })
  } catch (error) {
    return next(error)
  }
}
