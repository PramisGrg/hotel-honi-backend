import type { Response, NextFunction } from "express";
import { SecureRequest } from "../../interfaces/general/request.interface";
import KnownError from "../../utils/knownError.utils";
import { getAllUserInvitationsService, getUserInvitationService } from "../../services/user/invitaion.service";

interface IGetSingleInvitationRequest extends SecureRequest {
  params: { invitationId: string }
}
export async function getSingleInvitationController(req: IGetSingleInvitationRequest, res: Response, next: NextFunction) {
  try {
    if (!req.currentUser || !req.currentUser.id) {
      throw new KnownError('You must be logged in to perform this activity.', 403);
    }
    const response = await getUserInvitationService(req.currentUser.id, req.params.invitationId)
    return res.status(200).json({ message: 'Invitations fetched successfully.', data: response })
  } catch (error) {
    return next(error);
  }
}

export async function getAllInvitationController(req: SecureRequest, res: Response, next: NextFunction) {
  try {
    if (!req.currentUser || !req.currentUser.id) {
      throw new KnownError('You must be logged in to perform this activity.', 403);
    }
    const response = await getAllUserInvitationsService(req.currentUser.id)
    return res.status(200).json({ message: 'Invitations fetched successfully.', data: response })
  } catch (error) {
    return next(error);
  }
}