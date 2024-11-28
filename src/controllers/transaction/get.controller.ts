import type { Response, NextFunction } from "express";
import { SecureRequest } from "../../interfaces/general/request.interface";
import KnownError from "../../utils/knownError.utils";
import { transactionOf } from "@prisma/client";
import { getAllTransactionService, getTransactionService } from "../../services/transaction/get.service";




export async function getAllTransactionController(req: SecureRequest, res: Response, next: NextFunction) {
  try {
    if (!req.currentUser || !req.currentUser.id) {
      throw new KnownError("You must be logged in to perform this action", 304)
    }
    if (!req.currentUser.activeHotel) {
      throw new KnownError('Please switch to a hotel to create room.')
    }

    const response = await getAllTransactionService(req.currentUser.activeHotel)
    return res.status(200).json({ message: "Transaction fetched successfully.", data: response })
  } catch (error) {
    return next(error);
  }
}

interface IGetTransactionRequest extends SecureRequest {
  params: {
    userId: string
  },
  query: {
    transactionOf: transactionOf
  }
}

export async function getTransactionController(req: IGetTransactionRequest, res: Response, next: NextFunction) {
  try {
    if (!req.currentUser || !req.currentUser.id) {
      throw new KnownError("You must be logged in to perform this action", 304)
    }
    if (!req.currentUser.activeHotel) {
      throw new KnownError('Please switch to a hotel to create room.')
    }
    const userId = req.params.userId
    const transactionOf = req.query.transactionOf as transactionOf

    const response = await getTransactionService(req.currentUser.activeHotel, userId, transactionOf)

    return res.status(200).json({ message: "Transaction fetched successfully.", data: response })
  } catch (error) {
    return next(error);
  }
}