import { permission } from 'process'
import { z } from 'zod'

export const updateRoleSchema = z.object({
  customName: z.string({ message: 'Please provide a name for your hotel.' }).optional(),
  permissions: z.array(z.string({ message: 'Please provide a valid permission.' })).optional()
})

export type TUpdateRoleSchema = z.infer<typeof updateRoleSchema>
