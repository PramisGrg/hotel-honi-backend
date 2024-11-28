import { z } from 'zod'

export const loginUserSchema = z.object({
  dialCode: z.string({ message: 'Dial code is required.' }),
  phoneNumber: z
    .string({ message: 'Phone number is required.' })
    .min(10, { message: 'Please provide a valid phone number.' })
    .max(16, {
      message: 'Please provide a valid phone number.'
    }),
  password: z.string({ message: 'Password is required.' }).min(8, { message: 'Please provide a valid password.' })
})

export type TloginUserSchema = z.infer<typeof loginUserSchema>
