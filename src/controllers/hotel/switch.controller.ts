import type { Response, NextFunction } from "express";
import { SecureRequest } from "../../interfaces/general/request.interface";
import { TSwitchHotelSchema } from "../../schema/hotel/switch.schema";
import { switchHotelService } from "../../services/hotel/switch.service";
import KnownError from "../../utils/knownError.utils";

interface switchHotelRequest extends SecureRequest {
  body: TSwitchHotelSchema
}

export async function switchHotelController(req: switchHotelRequest, res: Response, next: NextFunction) {
  try {
    if (!req.currentUser) {
      throw new KnownError('Please login first to perform this action.')
    }
    const { hotelId } = req.body;
    const response = await switchHotelService(hotelId, req.currentUser.id);
    res.setHeader('Authorization', `Bearer ${response.token}`);
    return res.status(200).json({ message: "Hotel switched successfully.", data: response })
  } catch (error) {
    return next(error);
  }
}
