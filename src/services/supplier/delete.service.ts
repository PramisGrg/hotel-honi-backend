import Database from "../../configs/db.config"
import KnownError from "../../utils/knownError.utils"

export async function deleteSupplierService(supplierId: string, _userId: string, hotelId: string) {

  const deletedSupplier = await Database.client.hotelSuppliers.delete({ where: { id: supplierId, hotelId } });

  if (!deletedSupplier) {
    throw new KnownError("Failed to delete supplier.")
  }

  //todo: add activity for user deleted supplier

  return deletedSupplier
}
