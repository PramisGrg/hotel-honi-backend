import type { Response, NextFunction } from "express"
import { SecureRequest } from "../../interfaces/general/request.interface"
import KnownError from "../../utils/knownError.utils"
import { updateCustomerService } from "../../services/customer/update.service"

interface IUpdateCustomerRequest extends SecureRequest {
  params: { customerId: string }
}
export async function updateCustomerController(req: IUpdateCustomerRequest, res: Response, next: NextFunction) {
  try {
    if (!req.currentUser || !req.currentUser.id) {
      throw new KnownError("You must be loggedin to perform this activity.", 403)
    }
    if (!req.currentUser.activeHotel) {
      throw new KnownError("Please switch to a hotel to perform this action")
    }
    const response = await updateCustomerService(req.body, req.currentUser.id, req.params.customerId, req.currentUser.activeHotel)

    return res.status(200).json({ message: "Customer details updated successfully.", data: response })
  } catch (error) {
    return next(error)
  }
}
