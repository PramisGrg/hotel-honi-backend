import Database from "../../../configs/db.config"
import KnownError from "../../../utils/knownError.utils"

export async function getSingleRoomService(roomId: string, hotelId: string) {
  const existingRoom = await Database.client.room.findFirst({ where: { id: roomId, hotelId } })
  if (!existingRoom) {
    throw new KnownError("No room with provided ID was found.", 404)
  }

  return existingRoom
}

export async function getAllRoomService(hotelId: string, take: number, skip: number, search: string | undefined) {
  const existingRooms = await Database.client.room.findMany({
    where: { hotelId, name: { contains: search ?? undefined } },
    select: {
      id: true,
      name: true,
      capacity: true,
      price: true,
      status: true,
      description: true,
      images: true,
      space: {
        select: {
          id: true,
          name: true
        }
      }
    },
    take,
    skip,
    orderBy: { createdAt: "desc" }
  })
  return existingRooms
}
