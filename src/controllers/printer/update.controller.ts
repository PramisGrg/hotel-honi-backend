import { NextFunction, Response } from "express";
import { SecureRequest } from "../../interfaces/general/request.interface";
import { TUpdatePrinterSchema } from "../../schema/printer/update.schema";
import KnownError from "../../utils/knownError.utils";
import { updatePrinterService } from "../../services/printer/update.service";


interface IUodatePrinterRequest extends SecureRequest {
  body: TUpdatePrinterSchema
  params: { printerId: string }
}
export async function updatePrinterController(req: IUodatePrinterRequest, res: Response, next: NextFunction) {
  try {

    if (!req.currentUser || !req.currentUser.id) {
      throw new KnownError('You must be logged in to perform this action.', 403)
    }
    if (!req.currentUser.activeHotel) {
      throw new KnownError('Please switch to a hotel to perform this action.')
    }

    const response = await updatePrinterService(req.body, req.params.printerId, req.currentUser.activeHotel, req.currentUser.id);
    return res.status(200).json({ message: "Printer updated successfully.", data: response })

  } catch (error) {
    return next(error);
  }
}
