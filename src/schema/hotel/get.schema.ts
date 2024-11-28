import { z } from 'zod'

export const getHotelSchema = z.object({
  name: z.string({ message: 'please provide a name for your hotel.' }),
  address: z.string({ message: 'Please provide your hotel address.' }),
  primaryContact: z.string({
    message: 'Please provide a primary contact for hotel.'
  })
})

export type TGetHotel = z.infer<typeof getHotelSchema>
