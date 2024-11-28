import { NextFunction, Response } from "express";
import { SecureRequest } from "../../interfaces/general/request.interface";
import KnownError from "../../utils/knownError.utils";
import { createOrderService } from "../../services/order/create.service";
import { TCreateOrderSchema } from "../../schema/order/create.schema";


interface ICreateOrderRequest extends SecureRequest {
  body: TCreateOrderSchema
}
export async function createOrderController(req: ICreateOrderRequest, res: Response, next: NextFunction) {
  try {

    if (!req.currentUser || !req.currentUser.id) {
      throw new KnownError('You must be logged in to perform this activity.', 403)
    }

    if (!req.currentUser.activeHotel) {
      throw new KnownError('Please switch to a active hotel to perform this activity.');
    }

    const response = await createOrderService(req.body, req.currentUser.id, req.currentUser.activeHotel);

    return res.status(200).json({ message: "Order placed successfully.", data: response });

  } catch (error) {
    return next(error)
  }
}
