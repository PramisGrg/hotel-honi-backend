import bcrypt from 'bcrypt'
import Database from '../../configs/db.config'
import { TloginUserSchema } from '../../schema/auth/login.schema'
import KnownError from '../../utils/knownError.utils'
import { generateToken } from '../../utils/generateToken.utils'
import { RecentDeviceInfo } from '../../interfaces/general/request.interface'

export async function loginUserService(data: TloginUserSchema, deviceInfo: RecentDeviceInfo) {
  const existingUser = await Database.client.user.findFirst({
    where: {
      dialCode: data.dialCode,
      phoneNumber: data.phoneNumber
    },
  })

  if (!existingUser) {
    throw new KnownError('No user with such details was found, please register first.')
  }

  if (existingUser && !existingUser.isVerified) {
    throw new KnownError('No user with such details was found, please register first.')
  }

  const isPasswordValid = await bcrypt.compare(data.password, existingUser.passwordHash)
  if (!isPasswordValid) {
    throw new KnownError('Wrong password, please check and try again later.')
  }

  const refinedUserData = {
    ...existingUser,
    activeHotel: existingUser.activeHotelId ?? undefined,
    passwordHash: undefined,
    otpHash: undefined
  }

  const token = generateToken(refinedUserData, '15d')

  await Database.client.recentLogins.create({
    data: {
      userId: existingUser.id,
      deviceName: deviceInfo.deviceName ?? "Unknown Device",
      loginToken: String(token),
      oneSignalId: deviceInfo.oneSignalId ?? 'NA'
    }
  })
  return { token, responseData: refinedUserData }
}
