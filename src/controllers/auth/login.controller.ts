import type { Response, NextFunction } from 'express'
import { loginUserService } from '../../services/auth/login.service'
import { LoginRequest } from '../../interfaces/general/request.interface'
import KnownError from '../../utils/knownError.utils'

export async function loginUserController(req: LoginRequest, res: Response, next: NextFunction) {
  try {
    const data = req.body
    if (!req.deviceInfo) {
      throw new KnownError('Unable to detect your device, you can not login for security reasons.');
    }
    const { responseData, token } = await loginUserService(data, req.deviceInfo)
    res.setHeader('Authorization', `Bearer ${token}`)
    return res.status(200).json({
      message: 'User logged in successfully.',
      data: { ...responseData, token }
    })
  } catch (error) {
    return next(error)
  }
}
