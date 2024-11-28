import Database from "../../configs/db.config";
import KnownError from "../../utils/knownError.utils";

export async function getSinglePrinterService(printerId: string, hotelId: string) {

  const existingPrinter = await Database.client.printer.findFirst({ where: { id: printerId, hotelId } });
  if (!existingPrinter) {
    throw new KnownError('No printer with such details was found.', 404)
  }
  return existingPrinter
}


export async function getAllPrinterService(hotelId: string, take: number, skip: number, search: string) {
  const existingPrinters = await Database.client.printer.findMany({
    where: { hotelId, name: { contains: search } }, take, skip, orderBy: { createdAt: "desc" }
  });
  return existingPrinters;
}
