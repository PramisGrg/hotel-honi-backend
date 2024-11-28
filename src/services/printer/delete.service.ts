import Database from "../../configs/db.config";
import KnownError from "../../utils/knownError.utils";

export async function deletePrinterService(printerId: string, hotelId: string, userId: string) {
  const deletedPrinter = await Database.client.printer.delete({ where: { id: printerId, hotelId } });
  if (!deletedPrinter) {
    throw new KnownError('No printer with such details was found to delete.')
  }
  //todo: add a activity to indicate that the user deleted.
  return deletedPrinter
}
