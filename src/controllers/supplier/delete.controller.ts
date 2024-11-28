import type { Response, NextFunction } from "express"
import { SecureRequest } from "../../interfaces/general/request.interface"
import KnownError from "../../utils/knownError.utils"
import { deleteSupplierService } from "../../services/supplier/delete.service"


interface IDeleteSupplierRequest extends SecureRequest {
  params: { supplierId: string }
}
export async function deleteSupplierController(req: IDeleteSupplierRequest, res: Response, next: NextFunction) {
  try {

    if (!req.currentUser || !req.currentUser.id) {
      throw new KnownError("You must be logged in to perform this action.", 403)
    }

    if (!req.currentUser.activeHotel) {
      throw new KnownError("Please switch to a hotel to perform this action.")
    }

    const response = await deleteSupplierService(req.params.supplierId, req.currentUser.id, req.currentUser.activeHotel)

    return res.status(200).json({ message: "Supplier deleted successfully.", data: response })
  } catch (error) {
    return next(error)
  }
}
