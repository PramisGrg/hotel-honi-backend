import type { Request, Response, NextFunction } from "express"
import {
  TRegisterUserResendOtpSchema,
  TRegisterUserSchema,
  TRegisterUserVerifyOtpSchema
} from "../../schema/auth/register.schema"
import {
  registerUserResendOtpService,
  registerUserService,
  registerUserVerifyOtpService
} from "../../services/auth/register.service"
import { LoginRequest } from "../../interfaces/general/request.interface"
import KnownError from "../../utils/knownError.utils"

interface registerUserRequest extends Request {
  body: TRegisterUserSchema
}
export async function registerUserController(req: registerUserRequest, res: Response, next: NextFunction) {
  try {
    const data = req.body
    const response = await registerUserService(data)
    return res.status(200).json({ message: "Registration successful.", data: response })
  } catch (error) {
    return next(error)
  }
}

interface registerUserResendOtpRequest extends Request {
  body: TRegisterUserResendOtpSchema
}
export async function registerUserResendOtpController(
  req: registerUserResendOtpRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const data = req.body
    const response = await registerUserResendOtpService(data.id)
    return res.status(200).json({ message: "OTP resend successfully.", data: response })
  } catch (error) {
    return next(error)
  }
}

interface registerUserVerifyOtpRequest extends LoginRequest {
  body: TRegisterUserVerifyOtpSchema
}
export async function registerUserVerifyOtpController(
  req: registerUserVerifyOtpRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const data = req.body
    if (!req.deviceInfo) {
      throw new KnownError('Unable to detect your device, you can not login for security reasons.');
    }
    const { responseData, token } = await registerUserVerifyOtpService(data, req.deviceInfo)
    res.setHeader("Authorization", `Bearer ${token}`)
    return res.status(200).json({ message: "Account verified successfully.", data: { ...responseData, token } })
  } catch (error) {
    return next(error)
  }
}
