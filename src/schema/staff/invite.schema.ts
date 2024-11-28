import { InvitationStatus, roleName } from '@prisma/client';
import { z } from 'zod';

export const inviteStaffSchema = z.object({
  dialCode: z.string({ message: 'Phone number must be valid.' }),
  phoneNumber: z.string({ message: 'Phone number must be valid.' })
    .min(9, { message: 'Please provide a valid phone number.' })
    .max(16, { message: 'Please provide a valid phone number.' }),
  role: z.object({
    type: z.nativeEnum(roleName, { message: 'Please select a valid role type.' }).optional(),
    id: z.string({ message: 'Please provide a valid role id.' }).min(8, { message: 'Please select a valid role.' }).optional()
  })
});

export const updateInviteStaffSchema = z.object({
  invitationId: z.string({ message: 'Please provide a valid invitation ID.' }),
  role: z.object({
    type: z.nativeEnum(roleName, { message: 'Please select a valid role type.' }),
    id: z.string({ message: 'Please provide a valid role id.' }).min(8, { message: 'Please select a valid role.' })
  }).optional()
});

export const invitationActionSchema = z.object({
  invitationId: z.string({ message: 'Please provide a valid invitation ID.' }),
  status: z.nativeEnum(InvitationStatus, { message: 'Please provide a valid status.' })
})


export type TInviteStaffSchema = z.infer<typeof inviteStaffSchema>
export type TUpdateInviteStaffSchema = z.infer<typeof updateInviteStaffSchema>
export type TInvitationActionSchema = z.infer<typeof invitationActionSchema>
