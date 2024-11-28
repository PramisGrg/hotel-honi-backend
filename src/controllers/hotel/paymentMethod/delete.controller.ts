import { NextFunction, Response } from "express";
import { SecureRequest } from "../../../interfaces/general/request.interface";
import KnownError from "../../../utils/knownError.utils";
import { deletePaymentMethodService } from "../../../services/hotel/paymentMethod/delete.service";

export async function deletePaymentMethodController(req: SecureRequest, res: Response, next: NextFunction) {
  try {
    if (!req.currentUser || !req.currentUser.id) {
      throw new KnownError('You must be logged in to perform this action.', 403);
    }
    if (!req.currentUser.activeHotel) {
      throw new KnownError('Please switch to a hotel to perform this action.')
    }
    const paymentMethodId: string = req.params.paymentMethodId;
    const response = await deletePaymentMethodService(req.currentUser.id, req.currentUser.activeHotel, paymentMethodId);
    return res.status(200).json({ message: 'Payment method deleted successfully.', data: response });
  } catch (error) {
    return next(error);
  }
}
