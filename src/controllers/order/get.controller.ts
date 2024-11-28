import { NextFunction, Response } from "express";
import { SecureRequest } from "../../interfaces/general/request.interface";
import KnownError from "../../utils/knownError.utils";
import { getAllOrderService, getSingleOrderService } from "../../services/order/get.service";
import { KotStatus, OrderType } from "@prisma/client";

interface IGetAllOrderRequest extends SecureRequest {
  params: { orderType: string, status: string }
}
export async function getAllOrderController(req: IGetAllOrderRequest, res: Response, next: NextFunction) {
  try {

    if (!req.currentUser || !req.currentUser.id) {
      throw new KnownError('You must be logged in to perform this action.', 403);
    }

    if (!req.currentUser.activeHotel) {
      throw new KnownError('Please switch to a hotel to perform this action.')
    }
    const orderType = req.query.orderType as OrderType
    const status = req.query.status as KotStatus
    const response = await getAllOrderService(orderType, status, req.currentUser.activeHotel);
    return res.status(200).json({ message: "Order fetched successfully.", data: response })
  } catch (error) {
    return next(error);
  }
}


interface IGetSingleOrderRequest extends SecureRequest {
  params: { orderId: string }
}
export async function getSingleOrderController(req: IGetSingleOrderRequest, res: Response, next: NextFunction) {
  try {

    if (!req.currentUser || !req.currentUser.id) {
      throw new KnownError('You must be logged in to perform this action.')
    }

    if (!req.currentUser.activeHotel) {
      throw new KnownError('Please switch to a hotel to perform this action.')
    }

    const response = await getSingleOrderService(req.params.orderId, req.currentUser.activeHotel);
    return res.status(200).json({ message: "Order details fetched successfully.", data: response },)
  } catch (error) {
    return next(error)
  }
}
