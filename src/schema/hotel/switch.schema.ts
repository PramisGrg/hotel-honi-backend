import { z } from 'zod';

export const switchHotelSchema = z.object({
    hotelId: z.string({ message: "Id of hotel to switch is required.", }).min(8, { message: "Please provide a valid Id to switch." })
})

export type TSwitchHotelSchema = z.infer<typeof switchHotelSchema>