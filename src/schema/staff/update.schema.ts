import { roleName } from '@prisma/client';
import { z } from 'zod';

export const updateStaffSchema = z.object({
  staffId: z.string({ message: 'Please provide a valid Staff ID.' }),
  role: z.object({
    type: z.nativeEnum(roleName, { message: 'Please select a valid role type.' }).optional(),
    id: z.string({ message: 'Please provide a valid role id.' }).min(8, { message: 'Please select a valid role.' }).optional()
  })
});


export type TUpdateStaffSchema = z.infer<typeof updateStaffSchema>
