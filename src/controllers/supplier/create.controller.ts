import type { Response, NextFunction } from "express"
import { SecureRequest } from "../../interfaces/general/request.interface"
import { TCreateSupplierSchema } from "../../schema/supplier/create.schema"
import KnownError from "../../utils/knownError.utils"
import { createSupplierService } from "../../services/supplier/create.service"

interface ICreateSupplierRequest extends SecureRequest {
  body: TCreateSupplierSchema
}
export async function createSupplierController(req: ICreateSupplierRequest, res: Response, next: NextFunction) {
  try {

    if (!req.currentUser || !req.currentUser.id) {
      throw new KnownError("You must be logged in to perform this action.", 403)
    }

    if (!req.currentUser.activeHotel) {
      throw new KnownError("Please switch to a hotel to perform this action.")
    }

    const response = await createSupplierService(req.body, req.currentUser.id, req.currentUser.activeHotel)

    return res.status(200).json({ message: "Supplier created successfully.", data: response })
  } catch (error) {
    return next(error)
  }
}
