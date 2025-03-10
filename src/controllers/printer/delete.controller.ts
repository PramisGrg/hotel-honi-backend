import { NextFunction, Response } from "express";
import { SecureRequest } from "../../interfaces/general/request.interface";
import KnownError from "../../utils/knownError.utils";
import { deletePrinterService } from "../../services/printer/delete.service";


interface IDeletePrinterRequest extends SecureRequest {
  params: { printerId: string }
}
export async function deletePrinterController(req: IDeletePrinterRequest, res: Response, next: NextFunction) {
  try {
    if (!req.currentUser || !req.currentUser.id) {
      throw new KnownError('You must be logged in to perform this action.', 403)
    }
    if (!req.currentUser.activeHotel) {
      throw new KnownError('Please switch to a hotel to perform this action.')
    }
    const response = await deletePrinterService(req.params.printerId, req.currentUser.activeHotel, req.currentUser.id);
    return res.status(200).json({ message: "Printer deleted successfully.", data: response });
  } catch (error) {
    return next(error)
  }
}
