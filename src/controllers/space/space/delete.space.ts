import type { Response, NextFunction } from "express";
import { SecureRequest } from "../../../interfaces/general/request.interface";
import KnownError from "../../../utils/knownError.utils";
import { deleteSpaceService } from "../../../services/space/space/delete.service";

interface IUpdateSpaceRequest extends SecureRequest {
  params: { spaceId: string }
}
export async function deleteSpaceController(req: IUpdateSpaceRequest, res: Response, next: NextFunction) {
  try {

    if (!req.currentUser || !req.currentUser.id) {
      throw new KnownError('You must be logged in to perform this action.', 403);
    }

    if (!req.currentUser.activeHotel) {
      throw new KnownError('Please switch your hotel to perform this action.')
    }

    const response = await deleteSpaceService(req.params.spaceId, req.currentUser.id, req.currentUser.activeHotel);

    return res.status(200).json({ message: 'Space deleted successfully.', data: response })
  } catch (error) {
    return next(error);
  }
}
