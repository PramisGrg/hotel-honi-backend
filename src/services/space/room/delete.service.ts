import Database from "../../../configs/db.config";
import KnownError from "../../../utils/knownError.utils";

export async function deleteRoomService(hotelId: string, _userId: string, roomId: string) {
  const deletedRoom = await Database.client.room.delete({ where: { id: roomId, hotelId } });
  if (!deletedRoom) {
    throw new KnownError('Sorry, the room to delete was not found.', 404)
  }
  // todo: add the user deleted room activity later here.
  return deletedRoom;
}
