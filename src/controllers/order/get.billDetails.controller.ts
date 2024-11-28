import { Response, NextFunction } from "express"
import { SecureRequest } from "../../interfaces/general/request.interface"
import KnownError from "../../utils/knownError.utils"
import { TGetBillDetailsSchema } from "../../schema/order/get.billDetails.schema"
import { getBillDetailsService } from "../../services/order/get.billDetails.service"

interface IGetBillDetailsRequest extends SecureRequest {
  body: TGetBillDetailsSchema
}
export async function getBillDetailsController(req: IGetBillDetailsRequest, res: Response, next: NextFunction) {
  try {
    if (!req.currentUser || !req.currentUser.id) {
      throw new KnownError("You must be logged in to perform this action.", 403)
    }

    if (!req.currentUser.activeHotel) {
      throw new KnownError("Please switch to a hotel to perform this action")
    }

    const response = await getBillDetailsService(req.body, req.currentUser.id, req.currentUser.activeHotel)

    return res.status(200).json({ message: "Bill Details", data: response })
  } catch (error) {
    return next(error)
  }
}
