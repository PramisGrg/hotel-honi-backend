import { NextFunction, Response } from "express";
import { SecureRequest } from "../../../interfaces/general/request.interface";
import KnownError from "../../../utils/knownError.utils";
import { deleteRoomService } from "../../../services/space/room/delete.service";

export async function deleteRoomController(req: SecureRequest, res: Response, next: NextFunction) {
  try {
    if (!req.currentUser || !req.currentUser.id) {
      throw new KnownError('You must be logged in to perform this action.');
    }
    if (!req.currentUser.activeHotel) {
      throw new KnownError('Please switch to a active hotel to perform this action.');
    }
    const response = await deleteRoomService(req.currentUser.activeHotel, req.currentUser.id, req.params.roomId);
    return res.status(200).json({ message: "Room deleted successfully.", data: response })
  } catch (error) {
    return next(error)
  }
}
