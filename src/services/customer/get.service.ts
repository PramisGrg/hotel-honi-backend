import Database from "../../configs/db.config"
import KnownError from "../../utils/knownError.utils"

export async function getSingleCustomerService(customerId: string, hotelId: string) {
  const existingCustomer = await Database.client.hotelCustomer.findUnique({
    where: { id: customerId, hotelId }
  })
  if (!existingCustomer) {
    throw new KnownError("No customer with provided Id was found.", 404)
  }
  return { ...existingCustomer, openingBalance: 0.0, transactions: [] }
}

export async function getAllCustomerService(hotelId: string, take: number, skip: number, search: string) {
  const existingCustomer = await Database.client.hotelCustomer.findMany({
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

  return existingCustomer
}
