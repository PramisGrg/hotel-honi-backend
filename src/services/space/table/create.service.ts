import { TableStatus } from "@prisma/client";
import Database from "../../../configs/db.config";
import { TCreateTableSchema } from "../../../schema/space/table/create.schema";
import KnownError from "../../../utils/knownError.utils";

export async function createTableService(data: TCreateTableSchema, _userId: string, hotelId: string) {

  const createdTable = await Database.client.table.create({
    data: {
      name: data.name,
      capacity: data.capacity,
      hotelId,
      status: TableStatus.AVAILABLE,
      spaceId: data.spaceId
    }
  });

  if (!createdTable) {
    throw new KnownError("Error while creating table, please try again later.")
  }

  //todo: add activity to indicate that the user has created a table

  return createdTable;

}
