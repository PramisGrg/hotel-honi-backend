import jwt from "jsonwebtoken"

import Database from "../../configs/db.config"
import { TUpdateUser } from "../../schema/user/update.schema"
import generateOtp from "../../utils/generateOtp.utils"
import KnownError from "../../utils/knownError.utils"
import { sendSMS } from "../external/sms.service"

export async function updateUserService(userId: string, data: TUpdateUser, avatar: string[] | undefined) {
  let otpHash = undefined
  if (data.dialCode && data.phoneNumber) {
    const otp = generateOtp()
    otpHash = jwt.sign({ dialCode: data.dialCode, phoneNumber: data.phoneNumber, otp }, process.env.JWT_SECRET ?? "")
    if (data.dialCode == "977" && data.phoneNumber) {
      await sendSMS(data.phoneNumber, `${otp} is your verification code for Hotel Honi`)
    } else {
      throw new KnownError("Sorry, the phone number or region is not supported right now.")
    }
  }

  const updateUser = await Database.client.user.update({
    where: { id: userId },
    data: {
      dialCode: data.dialCode,
      name: data.name,
      username: data.username,
      phoneNumber: data.phoneNumber,
      otpHash,
      isPhoneChangeVerified: false,
      avatar: avatar ? avatar[0] : undefined
    },
    select: {
      id: true,
      name: true,
      dialCode: true,
      phoneNumber: true,
      avatar: true,
      username: true,
      updatedAt: true,
      createdAt: true
    }
  })

  if (!updateUser) {
    throw new KnownError("Sorry, something went wrong while updating user.")
  }

  return updateUser
}

export async function updateUserVerifyOtpService(userId: string, otp: string) {
  const existingUser = await Database.client.user.findFirst({ where: { id: userId } })
  if (!existingUser) {
    throw new KnownError("The provided user is not valid")
  }

  if (!existingUser.otpHash) {
    throw new KnownError("The provided user did not request for any OTP code.")
  }

  try {
    const decodedOtp = jwt.verify(existingUser.otpHash, process.env.JWT_SECRET ?? "")
    if (String(otp) !== String(decodedOtp)) {
      throw new KnownError("Wrong OTP, please try again.")
    }
    await Database.client.user.update({ where: { id: userId }, data: { isPhoneChangeVerified: true } })
  } catch (error) {
    throw new KnownError("The provided otp code is either expired or invalid, please try again.")
  }

  const updatedUser = await Database.client.user.update({
    where: { id: existingUser.id },
    data: {
      isVerified: true,
      otpHash: null
    }
  })

  const refinedUserData = {
    ...updatedUser,
    passwordHash: undefined,
    otpHash: undefined
  }

  return refinedUserData
}
