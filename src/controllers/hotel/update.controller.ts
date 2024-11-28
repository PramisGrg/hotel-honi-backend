import type { Response, NextFunction } from 'express'
import { TUpdateHotel } from '../../schema/hotel/update.schema'
import { updateHotelService } from '../../services/hotel/update.service'
import { SecureRequest } from '../../interfaces/general/request.interface'
import KnownError from '../../utils/knownError.utils'

interface UpdateHotelRequest extends SecureRequest {
  body: TUpdateHotel,
}
export async function updateHotelController(req: UpdateHotelRequest, res: Response, next: NextFunction) {
  try {
    const data = req.body
    if (!req.currentUser) {
      throw new KnownError('Please login to make changes.', 403)
    }
    if (!req.currentUser.activeHotel) {
      throw new KnownError('Please switch to a hotel to make changes.')
    }

    const response = await updateHotelService(req.currentUser.activeHotel, data)

    return res.status(200).json({ message: 'Hotel updated successfully.', data: response })
  } catch (error) {
    return next(error)
  }
}
