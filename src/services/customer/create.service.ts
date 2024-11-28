import Database from "../../configs/db.config"
import { TCreateCustomerSchema } from "../../schema/customer/create.schema"

export async function createCustomerService(data: TCreateCustomerSchema, _userId: string, hotelId: string) {
  const customer = await Database.client.hotelCustomer.create({
    data: {
      name: data.name,
      contactNumber: data.contactNumber,
      address: data.address,
      email: data.emailAddress,
      hotelId
    }
  })

  //todo: add user activity to log

  return customer
}
