import type { Response, NextFunction } from "express";
import { SecureRequest } from "../../interfaces/general/request.interface";
import KnownError from "../../utils/knownError.utils";
import { deleteStaffInvitationService, deleteStaffService } from "../../services/staff/delete.service";

export async function deleteStaffInvitationController(req: SecureRequest, res: Response, next: NextFunction) {
  try {
    if (!req.currentUser || !req.currentUser.id) {
      throw new KnownError('You must be logged in to perform this activity.', 403)
    }
    if (!req.currentUser.activeHotel) {
      throw new KnownError('Please switch to a hotel to perform this activity.')
    }
    const response = await deleteStaffInvitationService(req.params.invitationId, req.currentUser.activeHotel);

    return res.status(200).json({ message: 'Staff invitation deleted successfully.', data: response });
  } catch (error) {
    return next(error);
  }
}

interface IDeleteStaffRequest extends SecureRequest {
  params: {
    staffId: string
  }
}

export async function deleteStaffController(req: IDeleteStaffRequest, res: Response, next: NextFunction) {
  try {
    if (!req.currentUser || !req.currentUser.id) {
      throw new KnownError('You must be logged in to perform this activity.', 403)
    }
    if (!req.currentUser.activeHotel) {
      throw new KnownError('Please switch to a hotel to perform this activity.')
    }
    const response = await deleteStaffService(req.params.staffId, req.currentUser.activeHotel, req.currentUser.id);

    return res.status(200).json({ message: 'Staff deleted successfully.', data: response });
  } catch (error) {
    return next(error)
  }
}