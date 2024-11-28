import { NextFunction, Response } from "express";
import { SecureRequest } from "../../../interfaces/general/request.interface";
import { TCreateSpaceSchema } from "../../../schema/space/space/create.schema";
import KnownError from "../../../utils/knownError.utils";
import { createSpaceService } from "../../../services/space/space/create.service";

interface ICreateSpaceController extends SecureRequest {
  body: TCreateSpaceSchema
}
export async function createSpaceController(req: ICreateSpaceController, res: Response, next: NextFunction) {
  try {

    if (!req.currentUser || !req.currentUser.id) {
      throw new KnownError('You must be logged in to perform this action', 403)
    }

    if (!req.currentUser.activeHotel) {
      throw new KnownError("Please switch to a hotel to perform this action")
    }

    const response = await createSpaceService(req.body, req.currentUser.id, req.currentUser.activeHotel);

    return res.status(200).json({ message: 'Space created successfully.', data: response })

  } catch (error) {
    return next(error);
  }
}
