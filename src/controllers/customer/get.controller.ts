import type { Response, NextFunction } from "express"
import { SecureRequest } from "../../interfaces/general/request.interface"
import KnownError from "../../utils/knownError.utils"
import { getAllCustomerService, getSingleCustomerService } from "../../services/customer/get.service"

export async function getSingleCustomerController(req: SecureRequest, res: Response, next: NextFunction) {
  try {
    if (!req.currentUser || !req.currentUser.id) {
      throw new KnownError("You must be logged in to perform this action", 403)
    }
    if (!req.currentUser.activeHotel) {
      throw new KnownError("Please switch to a hotel to perform this action")
    }
    const { customerId } = req.params;
    const response = await getSingleCustomerService(customerId, req.currentUser.activeHotel)
    return res.status(200).json({ message: "Customer data fetched successfully.", data: response })
  } catch (error) {
    return next(error)
  }
}

export async function getAllCustomerController(req: SecureRequest, res: Response, next: NextFunction) {
  try {
    if (!req.currentUser || !req.currentUser.id) {
      throw new KnownError("You must be logged in to perform this action.", 403)
    }
    if (!req.currentUser.activeHotel) {
      throw new KnownError("Please switch to a hotel to perform this action")
    }
    const response = await getAllCustomerService(
      req.currentUser.activeHotel,
      Number(req.query.take ?? 25),
      Number(req.query.skip ?? 0),
      String(req.query.search ?? "")
    )
    return res.status(200).json({ message: "Customer data fetched successfully.", data: response })
  } catch (error) {
    return next(error)
  }
}
