import Database from "../../../configs/db.config";
import { TCreatePaymentMethodSchema } from "../../../schema/hotel/paymentMethod/create.schema";
import KnownError from "../../../utils/knownError.utils";

export async function createPaymentMethodService(userId: string, hotelId: string, data: TCreatePaymentMethodSchema) {

  const createdPaymentMethod = await Database.client.paymentMethods.create({
    data: {
      name: data.name,
      remarks: data.remarks,
      hotelId
    }
  })

  if (!createdPaymentMethod) {
    throw new KnownError('Error creating payment method, please try again later.');
  }

  return createdPaymentMethod
}
