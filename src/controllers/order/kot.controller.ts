import type { Response, NextFunction } from "express";
import { SecureRequest } from "../../interfaces/general/request.interface";
import KnownError from "../../utils/knownError.utils";
import { getAllKotService, getKotService } from "../../services/order/kot/get.service";
import { updateKotItemService } from "../../services/order/kot/update.service";

interface TGetKotRequest extends SecureRequest {
  params: { kotId: string }
}
export async function getSingleKotController(req: TGetKotRequest, res: Response, next: NextFunction) {
  try {
    if (!req.currentUser || !req.currentUser.id) {
      throw new KnownError('You must be logged in to perform this action.', 403);
    }
    if (!req.currentUser.activeHotel) {
      throw new KnownError('Please switch to a hotel to perform this action.');
    }
    const response = await getKotService(req.currentUser.activeHotel, req.params.kotId);
    return res.status(200).json({ message: "Billing information retrieved successfully", data: response });
  } catch (error) {
    return next(error);
  }
}

interface IGetAllKotRequest extends SecureRequest {
  params: { orderId: string }
}
export async function getAllKotController(req: IGetAllKotRequest, res: Response, next: NextFunction) {
  try {
    if (!req.currentUser || !req.currentUser.id) {
      throw new KnownError('You must be logged in to perform this action.', 403);
    }
    if (!req.currentUser.activeHotel) {
      throw new KnownError('Please switch to a hotel to perform this action.');
    }
    const response = await getAllKotService(req.currentUser.activeHotel, req.params.orderId);
    return res.status(200).json({ message: 'Kot list retrieved successfully', data: response })
  } catch (error) {
    return next(error);
  }
}

interface IUpdateKotItemRequest extends SecureRequest {
  params: { kotId: string, kotItemId: string, orderId: string }
}
export async function updateKotItemController(req: IUpdateKotItemRequest, res: Response, next: NextFunction) {
  try {
    if (!req.currentUser || !req.currentUser.id) {
      throw new KnownError("You must be logged in to perform this action.", 403)
    }
    if (!req.currentUser.activeHotel) {
      throw new KnownError("Please switch to a active hotel to perform this action.")
    }

    const response = await updateKotItemService(req.body, req.params.kotId, req.params.kotItemId, req.params.orderId)

    return res.status(200).json({ message: "KOT item updated successfully", data: response })

  } catch (error) {
    return next(error);
  }
}