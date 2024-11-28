import { NextFunction, Response } from "express";
import { SecureRequest } from "../../../interfaces/general/request.interface";
import KnownError from "../../../utils/knownError.utils";
import { createRoomService } from "../../../services/space/room/create.service";
import { TCreateRoomSchema } from "../../../schema/space/room/create.schema";


interface ICreateRoomRequest extends SecureRequest {
  body: TCreateRoomSchema
}

export async function createRoomController(req: ICreateRoomRequest, res: Response, next: NextFunction) {
  try {

    if (!req.currentUser || !req.currentUser.id) {
      throw new KnownError("You must be logged in to perform this action", 304)
    }

    if (!req.currentUser.activeHotel) {
      throw new KnownError('Please switch to a hotel to create room.')
    }

    const response = await createRoomService(req.body, req.currentUser.activeHotel, req.currentUser.id, req.imageUrl);

    return res.status(200).json({ message: "Room created successfully.", data: response })

  } catch (error) {
    return next(error);
  }
}
