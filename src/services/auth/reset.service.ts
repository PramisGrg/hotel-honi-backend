import jwt, { JwtPayload } from 'jsonwebtoken'
import bcrypt from 'bcrypt'

import Database from '../../configs/db.config'
import {
  TResetUserPasswordResendOtp,
  TResetUserPasswordSendOtp,
  TResetUserPasswordSetNew,
  TResetUserPasswordVerifyOtp
} from '../../schema/auth/reset.schema'
import generateOtp from '../../utils/generateOtp.utils'
import KnownError from '../../utils/knownError.utils'
import { sendSMS } from '../external/sms.service'

export async function resetUserPasswordSendOtpService(data: TResetUserPasswordSendOtp) {
  const existingUser = await Database.client.user.findFirst({
    where: { dialCode: data.dialCode, phoneNumber: data.phoneNumber }
  })
  if (!existingUser) {
    throw new KnownError('No user with such phone number to reset password.')
  }
  const otp = generateOtp()
  const message = `${otp} is your OTP to reset password for hotel honi`
  const otpHash = jwt.sign(
    {
      type: 'reset',
      dialCode: existingUser.dialCode,
      phoneNumber: existingUser.phoneNumber,
      otp
    },
    process.env.JWT_SECRET ?? ''
  )
  if (existingUser.dialCode === '977') {
    try {
      await sendSMS(data.phoneNumber, message)
    } catch (error) {
      throw new KnownError('An unknown error while sending OTP to your phone.')
    }
  } else {
    // todo: implement sending OTP to other countries with any other provider
    throw new KnownError('Sorry, Your country is not supported right now. Please try again later.')
  }
  const updatedUser = await Database.client.user.update({
    where: { id: existingUser.id },
    data: { otpHash }
  })
  return { ...updatedUser, passwordHash: undefined, otpHash: undefined }
}

export async function resetUserPasswordResendOtpService(data: TResetUserPasswordResendOtp) {
  const existingUser = await Database.client.user.findFirst({
    where: { id: data.id }
  })
  if (!existingUser) {
    throw new KnownError('There is now user with provided ID to send reset otp.')
  }
  const otp = generateOtp()
  const message = `${otp} is your OTP to reset password for hotel honi`
  const otpHash = jwt.sign(
    {
      type: 'reset',
      dialCode: existingUser.dialCode,
      phoneNumber: existingUser.phoneNumber,
      otp
    },
    process.env.JWT_SECRET ?? ''
  )
  if (existingUser.dialCode == '977') {
    try {
      await sendSMS(existingUser.phoneNumber, message)
    } catch (error) {
      throw new KnownError('An unknown error while sending OTP to your phone.')
    }
  } else {
    // todo: implement sending OTP to other countries with any other provider
    throw new KnownError('Sorry, your country is not supported right now. Please try again later.')
  }
  const updatedUser = await Database.client.user.update({
    where: { id: existingUser.id },
    data: { otpHash }
  })
  return { ...updatedUser, otpHash: undefined, passwordHash: undefined }
}

export async function resetUserPasswordVerifyOtpService(data: TResetUserPasswordVerifyOtp) {
  const existingUser = await Database.client.user.findFirst({
    where: { id: data.id }
  })
  if (!existingUser) {
    throw new KnownError('Sorry, no user found with provided ID to reset password.')
  }
  if (!existingUser.otpHash) {
    throw new KnownError('Sorry, the current user did not request to reset password.')
  }
  const decodedData = jwt.decode(existingUser.otpHash) as JwtPayload as {
    otp: number
  }
  if (String(decodedData.otp) !== String(data.otp)) {
    throw new KnownError('Sorry, the otp provided is invalid. Please try again.')
  }
  const resetToken = jwt.sign(
    { ...existingUser, passwordHash: undefined, otpHash: undefined },
    process.env.JWT_SECRET ?? '',
    { expiresIn: '5m' }
  )
  return { resetToken }
}

export async function resetUserPasswordSetNewService(data: TResetUserPasswordSetNew) {
  type decodedUserDataType = {
    id: string
    name: string
    dialCode: string
    phoneNumber: string
    passwordHash: string
    isVerified: boolean
    otpHash: string | null
  }

  let decodedData

  try {
    decodedData = jwt.verify(data.token, process.env.JWT_SECRET ?? '') as JwtPayload as decodedUserDataType
  } catch (error) {
    throw new KnownError('The provided reset token is either invalid or is expired.')
  }
  const existingUser = await Database.client.user.findFirst({
    where: { id: decodedData.id }
  })
  if (!existingUser) {
    throw new KnownError('User with provided ID was not found.')
  }
  const hashedPassword = await bcrypt.hash(data.password, 10)
  const updatedUser = await Database.client.user.update({
    where: { id: existingUser.id },
    data: { passwordHash: hashedPassword }
  })
  return { ...updatedUser, passwordHash: undefined, otpHash: undefined }
}
