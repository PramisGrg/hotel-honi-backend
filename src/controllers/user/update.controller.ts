import type { Response, NextFunction } from "express"
import { TUpdateUser, TUpdateUserVerifyOtp } from "../../schema/user/update.schema"
import { updateUserService, updateUserVerifyOtpService } from "../../services/user/update.service"
import { SecureRequest } from "../../interfaces/general/request.interface"
import KnownError from "../../utils/knownError.utils"

interface UpdateUserRequest extends SecureRequest {
  body: TUpdateUser
}

export async function updateUserController(req: UpdateUserRequest, res: Response, next: NextFunction) {
  try {
    if (!req.currentUser || !req.currentUser.id) {
      throw new KnownError("You are not authorized to make this changes.", 403)
    }
    const response = await updateUserService(req.currentUser.id, req.body, req.imageUrl)
    return res.status(200).json({ message: "User updated successfully", data: { ...response } })
  } catch (error) {

    return next(error)
  }
}

interface IUpdateUserVerifyOtpRequest extends SecureRequest {
  body: TUpdateUserVerifyOtp
}

export async function updateUserVerifyOtpController(
  req: IUpdateUserVerifyOtpRequest,
  res: Response,
  next: NextFunction
) {
  try {
    if (!req.currentUser || req.currentUser.id) {
      throw new KnownError("You are not authorized to perform this action.")
    }
    const response = await updateUserVerifyOtpService(req.currentUser.id, req.body.otp)
    return res.status(200).json({ message: "User updated successfully.", data: response })
  } catch (error) {
    return next(error)
  }
}
