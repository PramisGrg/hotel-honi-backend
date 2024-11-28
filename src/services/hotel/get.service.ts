import Database from "../../configs/db.config"

export async function getHotelService(hotelId: string) {
  const hotelData = await Database.client.hotel.findFirst({
    where: { id: hotelId },
    include: { HotelUserRel: { select: { hotel: true, role: true } } }
  })

  return hotelData
}

export async function getAllHotelService(userId: string) {
  const hotels = await Database.client.hotelUserRel.findMany({
    where: { user: { id: userId } },
    select: {
      hotel: {
        select: {
          id: true,
          name: true,
          address: true
        }
      },
      role: {
        select: {
          name: true,
          id: true,
          permissions: true
        }
      },
    },
    orderBy: { hotel: { name: 'asc' } }
  })

  return hotels
}
