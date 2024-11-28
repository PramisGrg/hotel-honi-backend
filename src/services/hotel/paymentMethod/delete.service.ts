import Database from "../../../configs/db.config";
import KnownError from "../../../utils/knownError.utils";

export async function deletePaymentMethodService(_userId: string, hotelId: string, paymentMethodId: string) {
  const deletedPaymentMethod = await Database.client.paymentMethods.delete({ where: { id: paymentMethodId, hotelId } })
  if (!deletedPaymentMethod) {
    throw new KnownError('No such payment method found to delete', 404);
  }
  return deletedPaymentMethod
}
