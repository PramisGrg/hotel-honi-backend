import { NextFunction, Response } from "express";
import { SecureRequest } from "../../interfaces/general/request.interface";
import { inviteStaffService, inviteStaffActionService, updateInviteStaffService } from "../../services/staff/invite.service";
import KnownError from "../../utils/knownError.utils";
import { TInvitationActionSchema, TInviteStaffSchema, TUpdateInviteStaffSchema } from "../../schema/staff/invite.schema";
interface IInviteStaffRequest extends SecureRequest {
  body: TInviteStaffSchema
}
export async function inviteStaffController(req: IInviteStaffRequest, res: Response, next: NextFunction) {
  try {
    if (!req.currentUser || !req.currentUser.id) {
      throw new KnownError('You must be logged in to perform this action.', 403)
    }
    if (!req.currentUser.activeHotel) {
      throw new KnownError('Please switch to a valid hotel to perform this action.')
    }
    const response = await inviteStaffService(req.currentUser.activeHotel, req.currentUser.id, req.body);
    return res.status(200).json({ message: 'Staff invited successfully.', data: response });
  } catch (error) {
    return next(error);
  }
}
interface IUpdateInviteStaffRequest extends SecureRequest {
  body: TUpdateInviteStaffSchema
}
export async function updateInviteStaffController(req: IUpdateInviteStaffRequest, res: Response, next: NextFunction) {
  try {
    if (!req.currentUser || !req.currentUser.id) {
      throw new KnownError('You must be logged in to perform this action.', 403)
    }
    if (!req.currentUser.activeHotel) {
      throw new KnownError('Please switch to a valid hotel to perform this action.')
    }
    const response = await updateInviteStaffService(req.currentUser.activeHotel, req.currentUser.id, req.body);
    return res.status(200).json({ message: 'Staff invitation updated successfully.', data: response });
  } catch (error) {
    return next(error);
  }
}


interface IStaffInviteActionRequest extends SecureRequest {
  body: TInvitationActionSchema
}
export async function inviteStaffActionController(req: IStaffInviteActionRequest, res: Response, next: NextFunction) {
  try {
    if (!req.currentUser || !req.currentUser.id) {
      throw new KnownError('Please login to perform this action.', 403);
    }
    const response = await inviteStaffActionService(req.currentUser.id, req.body);

    return res.status(200).json({ message: 'Invitation updated successfully.', data: response })
  } catch (error) {
    return next(error);
  }
}