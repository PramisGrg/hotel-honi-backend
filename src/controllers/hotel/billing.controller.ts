import { NextFunction, Response } from "express";
import { SecureRequest } from "../../interfaces/general/request.interface";
import KnownError from "../../utils/knownError.utils";
import { createBillingInformationService, getBillingInformationService, updateBillingInformationService } from "../../services/hotel/billing.service";
import { TCreateBillingInformationSchema, TUpdateBillingInformationSchema } from "../../schema/hotel/billingInformation.schema";

export async function getBillingInformationController(req: SecureRequest, res: Response, next: NextFunction) {
  try {
    if (!req.currentUser || !req.currentUser.id) {
      throw new KnownError('You must be logged in to perform this action.', 403);
    }
    if (!req.currentUser.activeHotel) {
      throw new KnownError('Please switch to a hotel to perform this action.');
    }
    const response = await getBillingInformationService(req.currentUser?.activeHotel)
    return res.status(200).json({ message: "Billing information retrieved successfully", data: response });
  } catch (error) {
    next(error);
  }
}

interface ICreateBillingInformationRequest extends SecureRequest {
  body: TCreateBillingInformationSchema
}
export async function createBillingInformationController(req: ICreateBillingInformationRequest, res: Response, next: NextFunction) {
  try {
    if (!req.currentUser || !req.currentUser.id) {
      throw new KnownError('You must be logged in to perform this action.', 403);
    }
    if (!req.currentUser.activeHotel) {
      throw new KnownError('Please switch to a hotel to perform this action.')
    }
    const response = await createBillingInformationService(req.body, req.currentUser.activeHotel, req.currentUser.id)
    return res.status(200).json({ message: 'Billing information created successfully', data: response })
  } catch (e) {
    return next(e);
  }
}

interface IUpdateBillingInformationRequest extends SecureRequest {
  body: TUpdateBillingInformationSchema
}
export async function updateBillingInformationController(req: IUpdateBillingInformationRequest, res: Response, next: NextFunction) {
  try {
    if (!req.currentUser || !req.currentUser.id) {
      throw new KnownError('You must be logged in to perform this action.', 403);
    }
    if (!req.currentUser.activeHotel) {
      throw new KnownError('Please switch to a hotel to perform this action.');
    }

    const response = await updateBillingInformationService(req.body, req.currentUser.activeHotel, req.currentUser.id);
    return res.status(200).json({ message: 'Billing information updated successfully', data: response });

  } catch (error) {
    return next(error);
  }
}