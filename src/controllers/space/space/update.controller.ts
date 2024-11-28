import type { Response, NextFunction } from "express";
import { SecureRequest } from "../../../interfaces/general/request.interface";
import { TUpdateSpaceSchema } from "../../../schema/space/space/update.schema";
import KnownError from "../../../utils/knownError.utils";
import { updateSpaceService } from "../../../services/space/space/update.service";

interface IUpdateSpaceRequest extends SecureRequest {
  body: TUpdateSpaceSchema,
  params: { spaceId: string }
}
export async function updateSpaceController(req: IUpdateSpaceRequest, res: Response, next: NextFunction) {
  try {

    if (!req.currentUser || !req.currentUser.id) {
      throw new KnownError('You must be logged in to perform this action.', 403);
    }

    if (!req.currentUser.activeHotel) {
      throw new KnownError('Please switch your hotel to perform this action.')
    }

    const response = await updateSpaceService(req.body, req.params.spaceId, req.currentUser.id, req.currentUser.activeHotel)

    return res.status(200).json({ message: 'Space updated successfully.', data: response })

  } catch (error) {
    return next(error);
  }
}
