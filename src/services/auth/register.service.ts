import jwt, { JwtPayload } from "jsonwebtoken"
import bcrypt from "bcrypt"
import Database from "../../configs/db.config"
import { TRegisterUserSchema, TRegisterUserVerifyOtpSchema } from "../../schema/auth/register.schema"
import KnownError from "../../utils/knownError.utils"
import generateOtp from "../../utils/generateOtp.utils"
import { sendSMS } from "../external/sms.service"
import { RecentDeviceInfo, SecureRequestUserData } from "../../interfaces/general/request.interface"
import { generateToken } from "../../utils/generateToken.utils"

export async function registerUserService(data: TRegisterUserSchema) {
  let existingUser = await Database.client.user.findFirst({
    where: {
      dialCode: data.dialCode,
      phoneNumber: data.phoneNumber
    }
  })
  if (existingUser && existingUser.isVerified) {
    throw new KnownError("User with such phone number already exists, please login.")
  }

  const hashedPassword = await bcrypt.hash(data.password, 10)
  const otp = generateOtp()
  const message = `${otp} is your verification code for Hotel Honi`

  if (data.dialCode === "977") {
    const smsResult = await sendSMS(data.phoneNumber, message)
    if (!smsResult) {
      throw new KnownError("Sorry, an error occurred while sending OTP to your phone.")
    }
  } else {
    throw new KnownError("Sorry, Hotel Honi is not available for your region right now.")
  }

  const otpHash = jwt.sign(
    { dialCode: data.dialCode, phoneNumber: data.phoneNumber, otp },
    process.env.JWT_SECRET ?? ""
  )

  if (existingUser?.isVerified) {
    // ! if there is an existing user with is not till now verified.
    existingUser = await Database.client.user.update({
      where: {
        id: existingUser.id
      },
      data: {
        dialCode: data.dialCode,
        phoneNumber: data.phoneNumber,
        passwordHash: hashedPassword,
        otpHash: otpHash
      }
    })
  } else {
    // ! if there is no existing user.
    existingUser = await Database.client.user.create({
      data: {
        name: data.name,
        dialCode: data.dialCode,
        phoneNumber: data.phoneNumber,
        passwordHash: hashedPassword,
        otpHash: otpHash
      }
    })
  }
  const refinedUserData = {
    ...existingUser,
    otpHash: undefined,
    passwordHash: undefined
  }

  return refinedUserData
}

export async function registerUserResendOtpService(id: string) {
  const existingUser = await Database.client.user.findFirst({ where: { id } })
  if (!existingUser) {
    throw new KnownError("No user found with such phone number to send OTP.")
  }
  const otp = generateOtp()
  const otpHash = jwt.sign(
    {
      dialCode: existingUser.dialCode,
      phoneNumber: existingUser.phoneNumber,
      otp
    },
    process.env.JWT_SECRET ?? ""
  )
  const updatedUser = await Database.client.user.update({
    where: { id: existingUser.id },
    data: { otpHash }
  })

  const message = `${otp} is your verification code for Hotel Honi`

  if (existingUser.dialCode === "977") {
    const smsResult = await sendSMS(existingUser.phoneNumber, message)
    if (!smsResult) {
      throw new KnownError("Sorry, an error occurred while sending OTP to your phone.")
    }
  } else {
    throw new KnownError("Sorry, Hotel Honi is not available for your region right now.")
  }

  return { ...updatedUser, passwordHash: undefined, otpHash: undefined }
}

export async function registerUserVerifyOtpService(data: TRegisterUserVerifyOtpSchema, deviceInfo: RecentDeviceInfo) {
  const existingUser = await Database.client.user.findFirst({
    where: {
      dialCode: data.dialCode,
      phoneNumber: data.phoneNumber
    }
  })

  if (!existingUser) {
    throw new KnownError("Sorry, no user with such phone number was found.")
  }

  if (!existingUser.otpHash) {
    throw new KnownError("User do not have an OTP requested.")
  }

  try {
    const decodedData: any = jwt.verify(existingUser.otpHash, process.env.JWT_SECRET ?? "")
    if (String(data.otp) !== String(decodedData.otp)) {
      throw new KnownError("Wrong OTP, please try again.")
    }
  } catch (error) {
    throw new KnownError("Invalid OTP, please try again.")
  }

  const updatedUser = await Database.client.user.update({
    where: {
      id: existingUser.id
    },
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

  const tokenPayload: SecureRequestUserData = {
    ...existingUser,
    dialCode: existingUser.dialCode,
    name: existingUser.name,
    id: existingUser.id
  }
  const token = generateToken(tokenPayload, "30d")

  await Database.client.recentLogins.create({
    data: {
      userId: existingUser.id,
      deviceName: deviceInfo.deviceName ?? "Unknown Device",
      loginToken: String(token),
      oneSignalId: deviceInfo.oneSignalId ?? 'NA'
    }
  })

  return { responseData: refinedUserData, token }
}
