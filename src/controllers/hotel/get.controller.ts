import type { Response, NextFunction } from 'express'
import { getAllHotelService, getHotelService } from '../../services/hotel/get.service'
import { SecureRequest } from '../../interfaces/general/request.interface'
import KnownError from '../../utils/knownError.utils'

export async function getSingleHotelController(req: SecureRequest, res: Response, next: NextFunction) {
  try {
    if (!req.currentUser || !req.currentUser.activeHotel) {
      throw new KnownError('You must have an active hotel to get information');
    }
    const response = await getHotelService(req.currentUser.activeHotel)
    return res.status(200).json({ message: 'Hotel data fetched successfully.', data: response })
  } catch (error) {
    return next(error)
  }
}

export async function getAllHotelController(req: SecureRequest, res: Response, next: NextFunction) {
  try {
    if (!req.currentUser || !req.currentUser.id) {
      throw new KnownError('You must have an active hotel to get information');
    }
    const response = await getAllHotelService(req.currentUser.id)
    return res.status(200).json({ message: 'All hotels fetched successfully.', data: response })
  } catch (error) {
    return next(error)
  }
}
