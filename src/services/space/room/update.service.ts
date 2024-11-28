import Database from "../../../configs/db.config"
import KnownError from "../../../utils/knownError.utils"

export async function updateRoomService(roomId: string, data: any, _userId: string, hotelId: string, imageUrl: string[] | undefined) {
  const updatedRoom = await Database.client.room.update({
    where: { id: roomId, hotelId },
    data: { ...data, images: imageUrl || [] }
  });
  if (!updatedRoom) {
    throw new KnownError('No room with such details was found to update.');
  }

  // todo: add the user updated room activity later here.

  return updatedRoom
}
