import type { Response, NextFunction } from "express"
import { SecureRequest } from "../../../interfaces/general/request.interface"
import KnownError from "../../../utils/knownError.utils"
import { getAllSpaceService, getSingleSpaceService } from "../../../services/space/space/get.service"

export async function getAllSpaceController(req: SecureRequest, res: Response, next: NextFunction) {
  try {

    if (!req.currentUser || !req.currentUser.id) {
      throw new KnownError("You must be logged in to perform this action", 403)
    }

    if (!req.currentUser.activeHotel) {
      throw new KnownError("Please switch to a hotel to perform this action")
    }

    const response = await getAllSpaceService(
      req.currentUser.activeHotel,
      Number(req.query.take),
      Number(req.query.skip),
      String(req.query.search ?? '')
    )

    return res.status(200).json({ message: "Space fetched successfully.", data: response })

  } catch (error) {
    return next(error)
  }
}

interface IGetSingleSpaceRequest extends SecureRequest {
  params: { spaceId: string }
}
export async function getSingleSpaceController(req: IGetSingleSpaceRequest, res: Response, next: NextFunction) {
  try {

    if (!req.currentUser || !req.currentUser.id) {
      throw new KnownError("You must be logged in to perform this action", 403)
    }

    if (!req.currentUser.activeHotel) {
      throw new KnownError("Please switch to a hotel to perform this action")
    }

    const response = await getSingleSpaceService(req.params.spaceId, req.currentUser.activeHotel)

    return res.status(200).json({ message: "Space fetched successfully.", data: response })

  } catch (error) {
    return next(error)
  }
}
