import { NextFunction, Response } from "express";
import { SecureRequest } from "../../../interfaces/general/request.interface";
import KnownError from "../../../utils/knownError.utils";
import { createPaymentMethodService } from "../../../services/hotel/paymentMethod/create.service";

export async function createPaymentMethodController(req: SecureRequest, res: Response, next: NextFunction) {
  try {
    if (!req.currentUser || !req.currentUser.id) {
      throw new KnownError('You must be logged in to perform this action.', 403);
    }
    if (!req.currentUser.activeHotel) {
      throw new KnownError('Please switch to a hotel to perform this action.')
    }
    const response = await createPaymentMethodService(req.currentUser.id, req.currentUser.activeHotel, req.body);
    return res.status(200).json({ message: 'Payment method created successfully.', data: response });
  } catch (error) {
    return next(error);
  }
}
