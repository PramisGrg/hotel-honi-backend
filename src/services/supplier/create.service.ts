import Database from "../../configs/db.config"
import { TCreateSupplierSchema } from "../../schema/supplier/create.schema"
import KnownError from "../../utils/knownError.utils"

export async function createSupplierService(data: TCreateSupplierSchema, _userId: string, hotelId: string) {

  const createdSupplier = await Database.client.hotelSuppliers.create({
    data: {
      name: data.name,
      address: data.address,
      contactNumber: data.contactNumber,
      email: data.emailAddress,
      hotelId
    }
  })

  if (!createdSupplier) {
    throw new KnownError("Failed to create supplier.")
  }

  return createdSupplier
}
