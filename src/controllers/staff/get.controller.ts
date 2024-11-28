import { NextFunction, Response } from "express";
import { SecureRequest } from "../../interfaces/general/request.interface";
import KnownError from "../../utils/knownError.utils";
import { getAllStaffService } from "../../services/staff/get.service";

export async function getAllStaffController(req: SecureRequest, res: Response, next: NextFunction) {
  try {
    if (!req.currentUser || !req.currentUser.id) {
      throw new KnownError('You must be logged in to perform this activity.', 403)
    }
    if (!req.currentUser.activeHotel) {
      throw new KnownError('Please switch to a hotel to perform this activity.')
    }
    const response = await getAllStaffService(req.currentUser.activeHotel);
    return res.status(200).json({ message: 'All staff fetched successfully.', data: response });
  } catch (error) {
    return next(error);
  }
}
