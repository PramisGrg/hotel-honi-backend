import Database from "../../../configs/db.config"
import { TCreateRoomSchema } from "../../../schema/space/room/create.schema"
import KnownError from "../../../utils/knownError.utils"

export async function createRoomService(data: TCreateRoomSchema, hotelId: string, _userId: string, imageUrl: string[] | undefined) {
  const createdRoom = await Database.client.room.create({
    data: {
      name: data.name,
      capacity: data.capacity,
      price: data.price,
      description: data.description ?? "",
      spaceId: data.spaceId,
      hotelId,
      images: imageUrl || []
    }
  })

  if (!createdRoom) {
    throw new KnownError("Failed to create room.")
  }

  //todo: Implement activity for this created room

  return createdRoom
}
