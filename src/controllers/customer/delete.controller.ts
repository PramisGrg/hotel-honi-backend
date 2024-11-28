import type { Response, NextFunction } from "express"
import { SecureRequest } from "../../interfaces/general/request.interface"
import { deleteCustomerService } from "../../services/customer/delete.service"
import KnownError from "../../utils/knownError.utils"

export async function deleteCustomerController(req: SecureRequest, res: Response, next: NextFunction) {
  try {
    if (!req.currentUser || !req.currentUser.id) {
      throw new KnownError('You need to be logged in to perform this activity.', 403);
    }
    if (!req.currentUser.activeHotel) {
      throw new KnownError('Please switch hotel to perform this activity.');
    }

    const response = await deleteCustomerService(req.params.customerId, req.currentUser.id, req.currentUser.activeHotel)
    return res.status(200).json({ message: "Customer deleted successfully.", data: response })
  } catch (error) {
    return next(error)
  }
}
