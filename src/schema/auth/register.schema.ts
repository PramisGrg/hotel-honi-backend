import { z } from 'zod'

export const registerUserSchema = z.object({
  name: z.string({ message: 'Name is required.' }).min(2, { message: 'Please provide a valid name.' }),
  dialCode: z.string({ message: 'Dial code is required.' }),
  phoneNumber: z
    .string({ message: 'Phone number is required.' })
    .min(10, { message: 'Please provide a valid phone number.' }), //min(10) length(10)
  password: z
    .string({ message: 'Password is required.' })
    .min(8, { message: 'Password must be at least 8 characters long.' })
})

export const registerUserResendOtpSchema = z.object({
  id: z
    .string({ message: 'Id of user is required to resend otp.' })
    .min(8, { message: 'Please provide a valid user id.' })
})

export const registerUserVerifyOtpSchema = z.object({
  dialCode: z.string({ message: 'Please provide a valid dialCode.' }),
  phoneNumber: z.string({ message: 'Please provide a valid phone number.' }),
  otp: z
    .string({ message: 'OTP code is required.' })
    .min(6, { message: 'OTP must be 6 digit long.' })
    .max(6, { message: 'OTP must be 6 digit long.' })
})

export type TRegisterUserResendOtpSchema = z.infer<typeof registerUserResendOtpSchema>
export type TRegisterUserVerifyOtpSchema = z.infer<typeof registerUserVerifyOtpSchema>
export type TRegisterUserSchema = z.infer<typeof registerUserSchema>
