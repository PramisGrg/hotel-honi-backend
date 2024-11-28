import type { Response, NextFunction } from "express";
import { SecureRequest } from "../../../interfaces/general/request.interface";
import KnownError from "../../../utils/knownError.utils";
import { getAllPaymentMethodService } from "../../../services/hotel/paymentMethod/get.service";

export async function getAllPaymentMethodController(req: SecureRequest, res: Response, next: NextFunction) {
  try {
    if (!req.currentUser || !req.currentUser.id) {
      throw new KnownError('You must be logged in to perform this action.', 403);
    }
    if (!req.currentUser.activeHotel) {
      throw new KnownError('Please switch to a hotel to perform this action.')
    }
    const response = await getAllPaymentMethodService(req.currentUser.activeHotel);

    return res.status(200).json({ "message": "Payment methods retrieved successfully.", "data": response });
  } catch (error) {
    return next(error);
  }
}