import Database from "../../configs/db.config"
import KnownError from "../../utils/knownError.utils"
import { TGetBillDetailsSchema } from "../../schema/order/get.billDetails.schema";

export async function getBillDetailsService(data: TGetBillDetailsSchema, userId: string, hotelId: string) {

  const order = await Database.client.orders.findFirst({ where: { id: data.orderId, hotelId, isDeleted: false } });

  if (!order) {
    throw new KnownError("No order with such information was found to checkout", 404)
  }

  if (order.isDeleted) {
    throw new KnownError("This order has already been checked out.", 404)
  }

  const kot = await Database.client.kot.findMany({
    where: { ordersId: data.orderId, hotelId },
    include: { KotItems: { include: { item: true } } }
  })

  let totalLineItemPrice: number = 0;
  let totalAmount: number = 0;
  let discountAmount: number = 0;

  for (let x = 0; x < kot.length; x++) {
    const currentKot = kot[x];
    if (!currentKot.KotItems) {
      throw new KnownError('No items found for this KOT.');
    }

    currentKot.KotItems.forEach((item) => {
      if (item.status !== "CANCELLED") {
        totalLineItemPrice += Number(item.item.price * item.quantity);
        totalAmount = totalLineItemPrice
      }
    });
  }

  if (!kot) {
    throw new KnownError("No order with such information was found to checkout", 404)
  }

  const hotelBillingInformation = await Database.client.billingInformation.findFirst({ where: { hotelId: hotelId } })
  if (!hotelBillingInformation) {
    throw new KnownError("No hotel with such information was found to checkout order from.", 404)
  }

  let totalBillAmount = 0


  let serviceCharge: number = 0
  let totalServiceCharge = 0
  let serviceChargeType: string = "PERCENTAGE";

  if (!data.isCustomBill) {
    if (hotelBillingInformation.serviceChargeType == "PERCENTAGE") {
      totalServiceCharge = totalLineItemPrice * (hotelBillingInformation.serviceCharge / 100)
      serviceCharge = hotelBillingInformation.serviceCharge
    } else {
      totalServiceCharge = hotelBillingInformation.serviceCharge
      serviceCharge = hotelBillingInformation.serviceCharge
      serviceChargeType = "AMOUNT"
    }
  } else {
    if (data.discountType == "PERCENTAGE") {
      discountAmount = totalLineItemPrice * (Number(data.discount) / 100)
      totalLineItemPrice = totalLineItemPrice - (totalLineItemPrice * (Number(data.discount) / 100))
    } else {
      totalLineItemPrice = totalLineItemPrice - Number(data.discount)
      discountAmount = Number(data.discount)
    }
    if (data.serviceChargeType == "PERCENTAGE") {
      totalServiceCharge = totalLineItemPrice * (Number(data.serviceCharge) / 100)
      serviceCharge = Number(data.serviceCharge)
    } else {
      totalServiceCharge = Number(data.serviceCharge)
      serviceCharge = Number(data.serviceCharge)
    }
  }

  const totalTaxAmount = totalLineItemPrice * (hotelBillingInformation.taxRate / 100)

  totalBillAmount = totalLineItemPrice + totalTaxAmount + totalServiceCharge

  const billDetails = {
    totalLineItem: totalAmount,
    discount: Number(data.discount),
    discountType: data.discountType,
    discountAmount,
    afterDiscount: totalLineItemPrice,
    serviceCharge: serviceCharge,
    serviceChargeType: data.serviceChargeType,
    totalServiceCharge,
    taxRate: hotelBillingInformation.taxRate,
    totalTaxAmount,
    totalBillAmount
  }

  return billDetails
}
