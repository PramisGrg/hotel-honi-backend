import { z } from 'zod'

export const updateHotelSchema = z.object({
  name: z.string({ message: 'Please provide a name for your hotel.' }).optional(),
  address: z.string({ message: 'Please provide your hotel address.' }).optional(),
  primaryContact: z.string({ message: 'Please provide a primary contact for hotel.' }).optional()
})

export type TUpdateHotel = z.infer<typeof updateHotelSchema>
