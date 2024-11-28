import { Request, Response, NextFunction } from "express";
import { SecureRequest } from "../../interfaces/general/request.interface";
import KnownError from "../../utils/knownError.utils";
import { getAllRecentDeviceService } from "../../services/user/getRecentDevice.service";
import { deleteRecentDeviceLoginService } from "../../services/user/deleteRecentDevice.service";

export async function getAllRecentDeviceController(req: SecureRequest, res: Response, next: NextFunction) {
  try {
    if (!req.currentUser || !req.currentUser.id) {
      throw new KnownError('You must be logged in to perform this activity.', 403)
    }

    if (!req.currentUser.activeHotel) {
      throw new KnownError('Please switch to a active hotel to perform this activity.');
    }
    const response = await getAllRecentDeviceService(req.currentUser.id);
    return res.status(200).json({ message: "Recent device fetched successfully.", data: response });
  } catch (error) {
    return next(error);
  }
}

interface IDeleteRecentDeviceLoginRequest extends SecureRequest {
  params: { deviceId: string }
}
export async function deleteRecentDeviceLoginController(req: IDeleteRecentDeviceLoginRequest, res: Response, next: NextFunction) {
  try {
    if (!req.currentUser || !req.currentUser.id) {
      throw new KnownError('You must be logged in to perform this activity.', 403)
    }
    if (!req.params.deviceId) {
      throw new KnownError('Please select proper device to logout your account.');
    }
    const response = await deleteRecentDeviceLoginService(req.params.deviceId, req.currentUser.id);
    return res.status(200).json({ message: 'Device removed successfully', data: response });
  } catch (error) {
    return next(error);
  }
}
