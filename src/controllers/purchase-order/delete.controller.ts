import type { Response, NextFunction } from "express";
import { SecureRequest } from "../../interfaces/general/request.interface";
import KnownError from "../../utils/knownError.utils";
import { deletePurchaseOrderService } from "../../services/purchase-order/delete.service";


interface DeletePurchaseOrderRequest extends SecureRequest {
  params: {
    purchaseOrderId: string
  }
}

export async function deletePurchaseOrderController(req: DeletePurchaseOrderRequest, res: Response, next: NextFunction) {
  try {
    if (!req.currentUser || !req.currentUser.id) {
      throw new KnownError("You must be logged in to perform this action", 304)
    }
    if (!req.currentUser.activeHotel) {
      throw new KnownError('Please switch to a hotel to create room.')
    }
    const response = await deletePurchaseOrderService(req.params.purchaseOrderId, req.currentUser.id, req.currentUser.activeHotel)
    return res.status(200).json({ message: "Purchase Order deleted successfully", data: response })
  } catch (error) {
    return next(error)
  }
}