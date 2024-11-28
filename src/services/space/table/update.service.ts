import Database from "../../../configs/db.config";
import { TUpdateTableSchema } from "../../../schema/space/table/update.schema";
import KnownError from "../../../utils/knownError.utils";

export async function updateTableService(data: TUpdateTableSchema, tableId: string, userId: string, hotelId: string) {
  const updatedTable = await Database.client.table.update({
    where: { id: tableId, hotelId },data});

  if (!updatedTable) {
    throw new KnownError("Sorry, the table was not found to be updated.")
  }

  //todo: add activity to indicate table updated.
  return updatedTable;
}

