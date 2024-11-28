import type { Response, NextFunction } from "express";
import { SecureRequest } from "../../interfaces/general/request.interface";
import KnownError from "../../utils/knownError.utils";
import { getAllSalesService } from "../../services/sales/get.service";

export async function getAllSalesController(req: SecureRequest, res: Response, next: NextFunction) {
  try {
    if (!req.currentUser || !req.currentUser.id) {
      throw new KnownError("You must be logged in to perform this action", 304)
    }
    if (!req.currentUser.activeHotel) {
      throw new KnownError('Please switch to a hotel to create room.')
    }

    const response = await getAllSalesService(req.currentUser.activeHotel,
      Number(req.query.take ?? 25),
      Number(req.query.skip ?? 0),
      String(req.query.search ?? '')
    )

    return res.status(200).json({ "message": "All sales fetched successfully", "data": response })

  } catch (error) {
    return next(error);

  }

}