import Database from '../../configs/db.config'

export async function deleteHotelService(id: string) {
  const deleteHotel = await Database.client.hotel.delete({ where: { id } })

  return deleteHotel
}
