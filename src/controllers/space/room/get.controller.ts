import type { Response, NextFunction } from "express"
import { SecureRequest } from "../../../interfaces/general/request.interface"
import KnownError from "../../../utils/knownError.utils"
import { getAllRoomService, getSingleRoomService } from "../../../services/space/room/get.service"

interface IGetSingleRoomRequest extends SecureRequest {
  params: { roomId: string }
}
export async function getSingleRoomController(req: IGetSingleRoomRequest, res: Response, next: NextFunction) {
  try {
    if (!req.currentUser || !req.currentUser.id) {
      throw new KnownError("You must be logged in to perform this action.", 403)
    }
    if (!req.currentUser.activeHotel) {
      throw new KnownError("Please switch to a active hotel to perform this action.")
    }
    const response = await getSingleRoomService(req.params.roomId, req.currentUser.activeHotel)
    return res.status(200).json({ message: "Room fetched successfully.", data: response })
  } catch (error) {
    return next(error)
  }
}

export async function getAllRoomController(req: SecureRequest, res: Response, next: NextFunction) {
  try {
    if (!req.currentUser || !req.currentUser.id) {
      throw new KnownError("You must be logged in to perform this action.", 403)
    }
    if (!req.currentUser.activeHotel) {
      throw new KnownError("Please switch to a active hotel to perform this action.")
    }
    const response = await getAllRoomService(
      req.currentUser.activeHotel,
      Number(req.query.take ?? 25),
      Number(req.query.skip ?? 0),
      String(req.query.search ?? '')
    )
    return res.status(200).json({ message: "Rooms fetched successfully.", data: response })
  } catch (error) {
    return next(error)
  }
}
