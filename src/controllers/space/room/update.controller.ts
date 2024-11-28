import { NextFunction, Response } from "express";
import { SecureRequest } from "../../../interfaces/general/request.interface";
import KnownError from "../../../utils/knownError.utils";
import { updateRoomService } from "../../../services/space/room/update.service";
import { TUpdateRoomSchema } from "../../../schema/space/room/update.schema";


interface IUpdateRoomRequest extends SecureRequest {
  body: TUpdateRoomSchema,
  params: { roomId: string }
}
export async function updateRoomController(req: IUpdateRoomRequest, res: Response, next: NextFunction) {
  try {
    if (!req.currentUser || !req.currentUser.id) {
      throw new KnownError('You must be logged in to perform this action', 403)
    }
    if (!req.currentUser.activeHotel) {
      throw new KnownError('Please switch to a hotel to perform this action.')
    }
    const response = await updateRoomService(req.params.roomId, req.body, req.currentUser.id, req.currentUser.activeHotel, req.imageUrl);
    return res.status(200).json({ message: "Room updated successfully.", data: response })
  } catch (error) {
    return next(error);
  }
}
