import { z } from 'zod'

export const resetUserPasswordSendOtpSchema = z.object({
  dialCode: z.string({ message: 'Dial code is required.' }),
  phoneNumber: z
    .string({ message: 'Phone Number is required.' })
    .min(9, 'Please provide a valid phone number.')
    .max(16, { message: 'Please provide a valid phone number.' })
})

export const resetUserPasswordResendOtpSchema = z.object({
  id: z.string({ message: 'User ID is required to resend OTP.' }).min(8, { message: 'Please provide a valid user Id.' })
})

export const resetUserPasswordVerifyOtpSchema = z.object({
  id: z.string({ message: 'User Id is required to verify OTP.' }).min(8, { message: 'Please provide a valid user ID.' }),
  otp: z
    .string({ message: 'OTP is required to verify.' })
    .min(6, { message: 'Please provide a valid OTP to reset password.' })
    .max(6, { message: 'Please provide a valid OTP to reset password.' })
})

export const resetUserPasswordSetNewSchema = z.object({
  token: z.string({ message: 'Please provide a password reset token.' }),
  password: z
    .string({ message: 'Please provide a new password.' })
    .min(8, { message: 'New password must be at least 8 characters long.' })
})

export type TResetUserPasswordSendOtp = z.infer<typeof resetUserPasswordSendOtpSchema>
export type TResetUserPasswordResendOtp = z.infer<typeof resetUserPasswordResendOtpSchema>
export type TResetUserPasswordVerifyOtp = z.infer<typeof resetUserPasswordVerifyOtpSchema>
export type TResetUserPasswordSetNew = z.infer<typeof resetUserPasswordSetNewSchema>
