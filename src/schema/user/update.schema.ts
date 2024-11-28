import { z } from 'zod'

export const updateUserSchema = z.object({
  name: z.string({ message: 'Name must be a string.' }).min(2, { message: 'Please provide a valid name.' }).optional(),
  dialCode: z.string({ message: 'Dial code must be a string.' }).optional(),
  phoneNumber: z
    .string({ message: 'Phone number must be a string.' })
    .min(10, { message: 'Please provide a valid phone number.' })
    .optional(),
  username: z.string().min(4, { message: 'Please provide a valid username.' }).optional()
})

export const updateUserVerifyOtpSchema = z.object({
  otp: z.string({ message: "OTP is required." }).min(6, { message: "Please provide a valid OTP." }).max(6, { message: "Please provide a valid OTP." })
})

export type TUpdateUserVerifyOtp = z.infer<typeof updateUserVerifyOtpSchema>
export type TUpdateUser = z.infer<typeof updateUserSchema>
