import type { Response, NextFunction } from "express"
import { SecureRequest } from "../../interfaces/general/request.interface"
import { TChangePasswordSchema } from "../../schema/user/changePassword.schema"
import KnownError from "../../utils/knownError.utils"
import { changePasswordService } from "../../services/user/changePassword.service"

interface IChangePasswordRequest extends SecureRequest {
  body: TChangePasswordSchema
}
export async function changePasswordController(req: IChangePasswordRequest, res: Response, next: NextFunction) {
  try {
    if (!req.currentUser || !req.currentUser.id) {
      throw new KnownError("You must be logged in to change password.")
    }
    const data = req.body
    const response = await changePasswordService(data, req.currentUser.id)
    return res.status(200).json({ message: "Password changed successfully.", data: response })
  } catch (error) {
    return next(error)
  }
}
