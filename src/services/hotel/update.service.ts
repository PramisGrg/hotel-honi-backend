import Database from "../../configs/db.config"
import { TUpdateHotel } from "../../schema/hotel/update.schema"

export async function updateHotelService(hotelId: string, data: TUpdateHotel) {
  const updatedHotel = await Database.client.hotel.update({
    where: { id: hotelId },
    data: {
      name: data.name,
      address: data.address,
      primaryContact: data.primaryContact
    }
  })
  return updatedHotel
}
