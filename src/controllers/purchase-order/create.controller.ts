import type { Response, NextFunction } from "express";
import { SecureRequest } from "../../interfaces/general/request.interface";
import KnownError from "../../utils/knownError.utils";
import { TCreatePurchaseOrderSchema } from "../../schema/purchase-order/create.schema";
import { createPurchaseOrderService } from "../../services/purchase-order/create.service";

interface ICreatePurchaseOrderRequest extends SecureRequest {
  body: TCreatePurchaseOrderSchema
}

export async function createPurchaseOrderController(req: ICreatePurchaseOrderRequest, res: Response, next: NextFunction) {
  try {
    if (!req.currentUser || !req.currentUser.id) {
      throw new KnownError("You must be logged in to perform this action", 304)
    }
    if (!req.currentUser.activeHotel) {
      throw new KnownError('Please switch to a hotel to create room.')
    }

    const response = await createPurchaseOrderService(req.body, req.currentUser.id, req.currentUser.activeHotel)

    return res.status(200).json({ message: "Purchase Order created successfully", data: response })

  } catch (error) {
    return next(error)
  }
}