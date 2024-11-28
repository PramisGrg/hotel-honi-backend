import Database from "../../../configs/db.config"
import KnownError from "../../../utils/knownError.utils"

export async function deleteTableService(tableId: string, hotelId: string, _userId: string) {
  const deletedTable = await Database.client.table.delete({ where: { id: tableId, hotelId } })

  if (!deletedTable) {
    throw new KnownError("No table with such details was found to delete.", 404)
  }

  //todo: add activity to indicate that this user performed this activity

  return deletedTable
}
