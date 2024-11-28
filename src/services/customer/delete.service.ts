import Database from "../../configs/db.config"
import KnownError from "../../utils/knownError.utils"

export async function deleteCustomerService(customerId: string, userId: string, hotelId: string) {
  const deletedCustomer = await Database.client.hotelCustomer.delete({
    where: { id: customerId, hotelId }
  })

  //todo: add activity to indicate this user deleted customerId

  if (!deletedCustomer) {
    throw new KnownError('Failed to delete customer.')
  }
  return deletedCustomer
}
