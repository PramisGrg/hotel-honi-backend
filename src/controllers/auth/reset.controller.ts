import { Request, Response, NextFunction } from 'express'
import {
  TResetUserPasswordResendOtp,
  TResetUserPasswordSendOtp,
  TResetUserPasswordSetNew,
  TResetUserPasswordVerifyOtp
} from '../../schema/auth/reset.schema'
import {
  resetUserPasswordResendOtpService,
  resetUserPasswordSendOtpService,
  resetUserPasswordSetNewService,
  resetUserPasswordVerifyOtpService
} from '../../services/auth/reset.service'

interface IResetPasswordSendOtpRequest extends Request {
  body: TResetUserPasswordSendOtp
}
export async function resetUserPasswordSendOtpController(
  req: IResetPasswordSendOtpRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const data = req.body
    const response = await resetUserPasswordSendOtpService(data)
    return res.status(200).json({
      message: 'Password reset OTP sent to your phone number successfully.',
      data: response
    })
  } catch (error) {
    return next(error)
  }
}

interface IResetPasswordResendOtpRequest extends Request {
  body: TResetUserPasswordResendOtp
}
export async function resetUserPasswordResendOtpController(
  req: IResetPasswordResendOtpRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const data = req.body
    const response = await resetUserPasswordResendOtpService(data)
    return res.status(200).json({
      message: 'Password reset OTP resend successful.',
      data: response
    })
  } catch (error) {
    return next(error)
  }
}

interface IResetUserPasswordVerifyOtpRequest extends Request {
  body: TResetUserPasswordVerifyOtp
}
export async function resetUserPasswordVerifyOtpController(
  req: IResetUserPasswordVerifyOtpRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const data = req.body
    const response = await resetUserPasswordVerifyOtpService(data)
    return res.status(200).json({
      message: 'Password reset otp code verified successfully.',
      data: response
    })
  } catch (error) {
    return next(error)
  }
}

interface IResetPasswordSetNewRequest extends Request {
  body: TResetUserPasswordSetNew
}

export async function resetUserPasswordSetNewController(
  req: IResetPasswordSetNewRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const data = req.body
    const response = await resetUserPasswordSetNewService(data)
    return res.status(200).json({ message: 'Password changed successfully.', data: response })
  } catch (error) {
    return next(error)
  }
}
