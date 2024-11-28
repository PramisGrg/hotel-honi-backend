import Database from "../../../configs/db.config"

export async function getAllPaymentMethodService(hotelId: string) {
  const paymentMethods = await Database.client.paymentMethods.findMany({
    where: {
      hotelId
    }
  })

  return paymentMethods
}