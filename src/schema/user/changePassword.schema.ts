import { z } from "zod"

export const changePasswordSchema = z.object({
  currentPassword: z
    .string({ message: "Current password is required." })
    .min(8, { message: "Please provide a valid current password." }),
  newPassword: z
    .string({ message: "New password is required." })
    .min(8, { message: "Password must be at least 8 characters long." })
})

export type TChangePasswordSchema = z.infer<typeof changePasswordSchema>
