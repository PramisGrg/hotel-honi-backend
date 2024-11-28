import Database from "../../configs/db.config"
import KnownError from "../../utils/knownError.utils"

export async function getSingleSupplierService(supplierId: string, hotelId: string) {
  const existingSupplier = await Database.client.hotelSuppliers.findUnique({
    where: { id: supplierId, hotelId }
  })
  if (!existingSupplier) {
    throw new KnownError("Failed to get supplier details.")
  }

  return { ...existingSupplier, openingBalance: 0.0, transactions: [] }
}
export async function getAllSupplierService(hotelId: string, take: number, skip: number, search: string) {
  const existingSuppliers = await Database.client.hotelSuppliers.findMany({
    where: { hotelId, name: { contains: search } },
    select: {
      id: true,
      name: true,
      address: true,
      contactNumber: true,
      email: true,
      balance: true
    },
    take,
    skip,
    orderBy: { name: "asc" }
  })

  if (!existingSuppliers) {
    throw new KnownError("Failed to get supplier details.")
  }

  return existingSuppliers
}
