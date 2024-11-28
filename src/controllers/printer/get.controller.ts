import { NextFunction, Response } from "express";
import { SecureRequest } from "../../interfaces/general/request.interface";
import KnownError from "../../utils/knownError.utils";
import { getAllPrinterService, getSinglePrinterService } from "../../services/printer/get.service";

export async function getAllPrinterController(req: SecureRequest, res: Response, next: NextFunction) {
  try {
    if (!req.currentUser || !req.currentUser.id) {
      throw new KnownError('You must be logged in to perform this action.', 403)
    }
    if (!req.currentUser.activeHotel) {
      throw new KnownError('Please switch to a hotel to perform this action.')
    }
    const response = await getAllPrinterService(req.currentUser.activeHotel, Number(req.query.take ?? 25), Number(req.query.skip ?? 0), String(req.query.search ?? ''));
    return res.status(200).json({ message: "Printer fetched successfully.", data: response })
  } catch (error) {
    return next(error);
  }
}

interface IGetSinglePrinterRequest extends SecureRequest {
  params: { printerId: string }
}
export async function getSinglePrinterController(req: IGetSinglePrinterRequest, res: Response, next: NextFunction) {
  try {
    if (!req.currentUser || !req.currentUser.id) {
      throw new KnownError('You must be logged in to perform this action.', 403)
    }
    if (!req.currentUser.activeHotel) {
      throw new KnownError('Please switch to a hotel to perform this action.')
    }

    const response = await getSinglePrinterService(req.params.printerId, req.currentUser.activeHotel);

    return res.status(200).json({ message: "Printer fetched successfully.", data: response })
  } catch (error) {
    return next(error);
  }
}
