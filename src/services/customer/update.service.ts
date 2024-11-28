import Database from "../../configs/db.config"
import { TUpdateCustomerSchema } from "../../schema/customer/update.schema"
import KnownError from "../../utils/knownError.utils"

export async function updateCustomerService(data: TUpdateCustomerSchema, _userId: string, customerId: string, hotelId: string) {
  const updatedCustomer = await Database.client.hotelCustomer.update({
    where: { id: customerId, hotelId },
    data: {
      name: data.name,
      contactNumber: data.contactNumber,
      address: data.address,
      email: data.emailAddress
    }
  })

  if (!updatedCustomer) {
    throw new KnownError('Failed to update customer details.');
  }

  // todo: add activity indicating that this user updated the customer details

  return updatedCustomer
}
