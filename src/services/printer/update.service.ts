import Database from "../../configs/db.config";
import { TUpdatePrinterSchema } from "../../schema/printer/update.schema";
import KnownError from "../../utils/knownError.utils";

export async function updatePrinterService(data: TUpdatePrinterSchema, printerId: string, hotelId: string, _userId: string) {
  const updatedPrinter = await Database.client.printer.update({
    where: { id: printerId, hotelId }, data: {
      name: data.name,
      ipAddress: data.ipAddress,
      nickName: data.nickName,
      type: data.type
    }
  })
  if (!updatedPrinter) {
    throw new KnownError('No printer with such details was found to updated.', 404)
  }
  //todo: add this activity to indicate pritner updated
  return updatedPrinter;
}
