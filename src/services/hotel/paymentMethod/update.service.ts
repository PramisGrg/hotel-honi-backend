import Database from "../../../configs/db.config";
import { TUpdatePaymentMethodSchema } from "../../../schema/hotel/paymentMethod/update.schema";
import KnownError from "../../../utils/knownError.utils";

export async function updatePaymentMethodService(_userId: string, hotelId: string, data: TUpdatePaymentMethodSchema, paymentMethodId: string) {
  const updatedPaymentMethod = await Database.client.paymentMethods.update({ where: { id: paymentMethodId, hotelId }, data: { name: data.name, remarks: data.remarks } })
  if (!updatedPaymentMethod) {
    throw new KnownError('No such payment method found to delete', 404);
  }

  return updatedPaymentMethod;
}
