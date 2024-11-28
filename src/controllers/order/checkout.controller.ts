import { Response, NextFunction } from "express"
import { SecureRequest } from "../../interfaces/general/request.interface"
import KnownError from "../../utils/knownError.utils"
import { checkoutOrderService } from "../../services/order/checkout.service"
import { TCheckoutOrderSchema } from "../../schema/order/checkout.schema"

interface ICheckoutOrderRequest extends SecureRequest {
  body: TCheckoutOrderSchema
}
export async function checkoutOrderController(req: ICheckoutOrderRequest, res: Response, next: NextFunction) {
  try {
    if (!req.currentUser || !req.currentUser.id) {
      throw new KnownError("You must be logged in to perform this action.", 403)
    }

    if (!req.currentUser.activeHotel) {
      throw new KnownError("Please switch to a hotel to perform this action")
    }

    const response = await checkoutOrderService(req.body, req.currentUser.id, req.currentUser.activeHotel)

    return res.status(200).json({ message: "Checkout completed", data: response })
  } catch (error) {
    return next(error)
  }
}
