import Database from "../../configs/db.config"
import { TChangePasswordSchema } from "../../schema/user/changePassword.schema"
import KnownError from "../../utils/knownError.utils"
import bcrypt from "bcrypt"

export async function changePasswordService(data: TChangePasswordSchema, userId: string) {
  const existingUser = await Database.client.user.findFirst({
    where: { id: userId }
  })

  if (!existingUser) {
    throw new KnownError("User with such information was not found.", 403)
  }

  const isPasswordValid = await bcrypt.compare(data.currentPassword, existingUser.passwordHash)
  if (!isPasswordValid) {
    throw new KnownError("Wrong password, please check password and try again.")
  }

  const newPasswordHash = await bcrypt.hash(data.newPassword, 10)

  const updatedUser = await Database.client.user.update({
    where: { id: userId },
    data: { passwordHash: newPasswordHash }
  })

  const refinedUser = { ...updatedUser, otpHash: undefined, passwordHash: undefined }

  return refinedUser
}
