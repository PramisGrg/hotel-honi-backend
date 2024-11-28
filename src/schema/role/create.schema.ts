import { z } from 'zod'

export const createRoleSchema = z.object({
  customName: z.string({ message: 'Please provide a name for your hotel.' }),
  permissions: z.array(z.string({ message: 'Please provide a valid permission.' }))
})

export type TCreateRoleSchema = z.infer<typeof createRoleSchema>
