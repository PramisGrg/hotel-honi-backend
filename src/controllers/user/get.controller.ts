import type { Response, NextFunction } from 'express'
import { getUserService } from '../../services/user/get.service'
import { SecureRequest } from '../../interfaces/general/request.interface'
import KnownError from '../../utils/knownError.utils'

export async function getUserController(req: SecureRequest, res: Response, next: NextFunction) {
  try {
    if (!req.currentUser || !req.currentUser.id) {
      throw new KnownError('Please login to access your details')
    }
    const response = await getUserService(req.currentUser.id)
    return res.status(200).json({ message: 'User data fetched successfully.', data: { ...response, activeHotelId: req.currentUser.activeHotel } })
  } catch (error) {
    return next(error)
  }
}

