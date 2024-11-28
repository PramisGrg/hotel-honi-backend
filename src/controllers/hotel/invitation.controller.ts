import type { Response, NextFunction } from "express";
import { SecureRequest } from "../../interfaces/general/request.interface";
import { getInvitationsService } from "../../services/hotel/get.invitations.service";
import KnownError from "../../utils/knownError.utils";

export async function getInvitationsController(req: SecureRequest, res: Response, next: NextFunction) {
  try {
    if (!req.currentUser || !req.currentUser.id) {
      throw new KnownError('You must be logged in to perform this action.', 403)
    }
    if (!req.currentUser.activeHotel) {
      throw new KnownError('Please switch to a valid hotel to perform this action.')
    }
    const response = await getInvitationsService(req.currentUser.activeHotel);

    return res.status(200).json({ message: 'Invitations fetched successfully.', data: response });
  } catch (error) {
    return next(error);
  }
}
