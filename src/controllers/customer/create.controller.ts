import type { Response, NextFunction } from "express"
import { SecureRequest } from "../../interfaces/general/request.interface"
import KnownError from "../../utils/knownError.utils"
import { createCustomerService } from "../../services/customer/create.service"
import { TCreateCustomerSchema } from "../../schema/customer/create.schema"

interface ICreateCustomerController extends SecureRequest {
  body: TCreateCustomerSchema
}

export async function createCustomerController(req: ICreateCustomerController, res: Response, next: NextFunction) {
  try {
    if (!req.currentUser || !req.currentUser.id) {
      throw new KnownError("Please login to perform this activity", 403)
    }
    if (!req.currentUser.activeHotel) {
      throw new KnownError("Please switch to a hotel to perform this action")
    }
    const response = await createCustomerService(req.body, req.currentUser.id, req.currentUser.activeHotel)
    return res.status(200).json({ message: "Customer created successfully.", data: response })
  } catch (error) {
    return next(error)
  }
}
