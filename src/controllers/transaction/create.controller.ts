import type { Response, NextFunction } from "express";
import { SecureRequest } from "../../interfaces/general/request.interface";
import KnownError from "../../utils/knownError.utils";
import { TCreateTransactionSchema } from "../../schema/transaction/create.schema";
import { createTransactionService } from "../../services/transaction/create.service";

interface ICreateTransactionRequest extends SecureRequest {
  body: TCreateTransactionSchema
}
export async function createTransactionController(req: ICreateTransactionRequest, res: Response, next: NextFunction) {
  try {
    if (!req.currentUser || !req.currentUser.id) {
      throw new KnownError("You must be logged in to perform this action", 304)
    }
    if (!req.currentUser.activeHotel) {
      throw new KnownError('Please switch to a hotel to create room.')
    }

    const response = await createTransactionService(req.body, req.currentUser.activeHotel, req.currentUser.id)
    return res.status(201).json({ "message": "Transaction created successfully", "data": response })
  } catch (error) {
    return next(error);

  }
}