import { Request, Response, NextFunction } from "express";
import { SecureRequest } from "../../interfaces/general/request.interface";
import KnownError from "../../utils/knownError.utils";
import { getSupportService } from "../../services/support/get.service";

export async function getSupportController(req: SecureRequest, res: Response, next: NextFunction) {
  try {
    if (!req.currentUser || !req.currentUser.id) {
      throw new KnownError("You must be logged in to perform this action.", 403)
    }
    if (!req.currentUser.activeHotel) {
      throw new KnownError("Please switch to a active hotel to perform this action.")
    }

    const response = await getSupportService()

    return res.status(200).json({ message: "Supports fetched successfully.", data: response })
  } catch (error) {
    return next(error)

  }
}