import type { Response, NextFunction } from "express"
import { TCreateHotel } from "../../schema/hotel/create.schema"
import { createHotelService } from "../../services/hotel/create.service"
import { SecureRequest } from "../../interfaces/general/request.interface"
import KnownError from "../../utils/knownError.utils"

interface createHotelRequest extends SecureRequest {
  body: TCreateHotel
}
export async function createHotelController(req: createHotelRequest, res: Response, next: NextFunction) {
  try {
    if (!req.currentUser || !req.currentUser.id) {
      throw new KnownError("Please login to perform this action.")
    }
    const { hotel, token } = await createHotelService(req.body, req.currentUser.id)
    res.setHeader("Authorization", `Bearer ${token}`)
    return res.status(200).json({ message: "Hotel created successfully.", data: { hotel, token } })
  } catch (error) {
    return next(error)
  }
}
