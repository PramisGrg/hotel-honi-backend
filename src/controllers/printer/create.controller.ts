import { NextFunction, Response } from "express";
import { SecureRequest } from "../../interfaces/general/request.interface";
import KnownError from "../../utils/knownError.utils";
import { TCreatePrinterSchema } from "../../schema/printer/create.schema";
import { createPrinterService } from "../../services/printer/create.service";


interface ICreatePrinterRequest extends SecureRequest {
  body: TCreatePrinterSchema
}
export async function createPrinterController(req: ICreatePrinterRequest, res: Response, next: NextFunction) {
  try {
    if (!req.currentUser || !req.currentUser.id) {
      throw new KnownError('You must be logged in to perform this action.', 403);
    }
    if (!req.currentUser.activeHotel) {
      throw new KnownError('Please switch to a hotel to perform this action')
    }
    const response = await createPrinterService(req.body, req.currentUser.activeHotel, req.currentUser.id);
    return res.status(200).json({ message: "Printer created successfully.", data: response })
  } catch (error) {
    return next(error);
  }
}
