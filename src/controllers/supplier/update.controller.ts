import type { Response, NextFunction } from "express"
import { SecureRequest } from "../../interfaces/general/request.interface"
import { TUpdateSupplierSchema } from "../../schema/supplier/update.schema"
import KnownError from "../../utils/knownError.utils"
import { updateSupplierService } from "../../services/supplier/update.service"

interface IUpdateSupplierRequest extends SecureRequest {
  body: TUpdateSupplierSchema
}

export async function updateSupplierController(req: IUpdateSupplierRequest, res: Response, next: NextFunction) {
  try {
    if (!req.currentUser || !req.currentUser.id) {
      throw new KnownError("You must be logged in to perform this action.", 403)
    }
    if (!req.currentUser.activeHotel) {
      throw new KnownError("Please switch to a hotel to perform this action.")
    }
    const response = await updateSupplierService(req.body, req.params.supplierId, req.currentUser.id, req.currentUser.activeHotel);
    return res.status(200).json({ message: "Supplier updated successfully.", data: response })
  } catch (error) {
    return next(error)
  }
}
