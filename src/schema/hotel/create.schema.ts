import { z } from 'zod'

export const createHotelSchema = z.object({
  name: z.string({ message: 'Please provide a name for your hotel.' }),
  address: z.string({ message: 'Please provide your hotel address.' }),
  primaryContact: z.string({ message: 'Please provide a primary contact for hotel.' }).optional()
})

export type TCreateHotel = z.infer<typeof createHotelSchema>
