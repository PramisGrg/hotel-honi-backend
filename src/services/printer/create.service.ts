import Database from "../../configs/db.config";
import { TCreatePrinterSchema } from "../../schema/printer/create.schema";
import KnownError from "../../utils/knownError.utils";

export async function createPrinterService(data: TCreatePrinterSchema, hotelId: string, _userId: string) {
  const newPrinter = await Database.client.printer.create({
    data: {
      name: data.name,
      nickName: data.nickName,
      ipAddress: data.ipAddress,
      type: data.type,
      hotelId,
    }
  });
  if (!newPrinter) {
    throw new KnownError('There was an error creating printer, please try again later.')
  }

  //todo: add user activity to indicate that a printer was added.

  return newPrinter
}
