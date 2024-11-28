import Database from "../../configs/db.config"
import { TUpdateSupplierSchema } from "../../schema/supplier/update.schema"
import KnownError from "../../utils/knownError.utils"

export async function updateSupplierService(data: TUpdateSupplierSchema, supplierId: string, userId: string, hotelId: string) {
  const updatedSupplier = await Database.client.hotelSuppliers.update({
    where: {
      id: supplierId,
      hotelId
    },
    data: {
      name: data.name,
      contactNumber: data.contactNumber,
      email: data.emailAddress,
      address: data.address
    }
  })

  if (!updatedSupplier) {
    throw new KnownError("Failed to update supplier.")
  }

  return updatedSupplier
}
