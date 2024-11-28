import Database from "../../../configs/db.config";

export async function deleteSpaceService(spaceId: string, _userId: string, hotelId: string) {
  const deletedSpace = await Database.client.space.delete({ where: { id: spaceId, hotelId }, include: { Table: false, Room: false } });
  //todo: implement activity for this event.
  return deletedSpace;
}
