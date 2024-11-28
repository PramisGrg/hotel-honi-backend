import { CashFlowCategory, CashFlowStatus, transactionOf } from "@prisma/client"
import Database from "../../configs/db.config"
import { TCheckoutOrderSchema } from "../../schema/order/checkout.schema"
import KnownError from "../../utils/knownError.utils"

export async function checkoutOrderService(data: TCheckoutOrderSchema, userId: string, hotelId: string) {

  const order = await Database.client.orders.findFirst({ where: { id: data.orderId, hotelId, isDeleted: false }, include: { table: true, room: true } });

  if (!order) {
    throw new KnownError("No order with such information was found to checkout", 404)
  }

  if (order.isDeleted) {
    throw new KnownError("This order has already been checked out.", 404)
  }
  if (order.status != "SERVED") {
    throw new KnownError('One or more KOT items are not served, you can not checkout this order.');
  }

  const kot = await Database.client.kot.findMany({
    where: { ordersId: data.orderId, hotelId },
    include: { KotItems: { include: { item: true } } }
  })

  let totalLineItemPrice: number = 0;

  for (let x = 0; x < kot.length; x++) {
    const currentKot = kot[x];
    if (!currentKot.KotItems) {
      throw new KnownError('No items found for this KOT.');
    }

    currentKot.KotItems.forEach((item) => {
      if (item.status == "PENDING") {
        throw new KnownError('One or more items are not served, you cannot checkout.');
      }
      if (item.status == "SERVED") {
        totalLineItemPrice += Number(item.item.price * item.quantity);
      }
    });
  }

  if (!kot) {
    throw new KnownError("No order with such information was found to checkout", 404)
  }

  const hotelInformation = await Database.client.billingInformation.findFirst({ where: { hotelId: hotelId } })
  if (!hotelInformation) {
    throw new KnownError("No hotel with such information was found to checkout order from.", 404)
  }

  const orderData = {
    hotelId,
    userId,
    status: CashFlowStatus.NORMAL,
    category: CashFlowCategory.SALES,
    amount: Number(data.paymentDetails.amount ?? 0),
    paymentMethodId: data.paymentDetails.paymentMethodId,
    remarks: data.remarks ?? `Order check-out`
  }

  let totalBillAmount = 0

  let totalServiceCharge = 0

  if (!data.isCustomBill) {
    if (hotelInformation.serviceChargeType == "PERCENTAGE") {
      totalServiceCharge = totalLineItemPrice * (hotelInformation.serviceCharge / 100)
    } else {
      totalServiceCharge = hotelInformation.serviceCharge
    }
  } else {
    if (data.discountType == "PERCENTAGE") {
      totalLineItemPrice = totalLineItemPrice - (totalLineItemPrice * (Number(data.discount) / 100))
    } else {
      totalLineItemPrice = totalLineItemPrice - Number(data.discount)
    }
    if (data.serviceChargeType == "PERCENTAGE") {
      totalServiceCharge = totalLineItemPrice * (Number(data.serviceCharge) / 100)
    } else {
      totalServiceCharge = Number(data.serviceCharge)
    }
  }

  const totalTaxAmount = totalLineItemPrice * (hotelInformation.taxRate / 100)

  totalBillAmount = totalLineItemPrice + totalTaxAmount + totalServiceCharge

  if (Number(totalBillAmount) == Number(data.paymentDetails.amount)) {
    //for no credit required, add entry to cashflow and return
    const cashFlow = await Database.client.cashFlow.create({
      data: orderData, include: {
        hotel: true, paymentMethod: true, performedBy: {
          select: {
            name: true
          }
        }
      }
    })
    //mark all kot as complete

    if (order.tableId) {
      await Database.client.$transaction(
        [
          Database.client.orders.update({
            where: { id: order.id },
            data: { isDeleted: true }
          }),
          Database.client.table.update({
            where: { id: order.tableId }, data: { status: "AVAILABLE" }
          })],)
    }

    const responseData = {
      paymentMethod: cashFlow.paymentMethod.name,
      paidAmount: cashFlow.amount,
      credit: undefined,
      status: cashFlow.status,
      createdAt: cashFlow.createdAt,
      table: order.table?.name,
      room: order.room?.name,
      performedBy: cashFlow.performedBy.name
    }

    return responseData
  }

  if (!data.paymentDetails.isChangeMoneyReturned) {
    if (data.staffId && data.customerId) {
      throw new KnownError("Credit must be for either customer or staff, not both.");
    }
    if (!data.staffId && !data.customerId) {
      throw new KnownError("Credit must be for either customer or staff.");
    }
  }

  let remainingAmount: number = 0
  if (!data.paymentDetails.isChangeMoneyReturned) {
    remainingAmount = Number(data.paymentDetails.amount) - totalBillAmount
  } else if (!data.paymentDetails.isChangeMoneyReturned && data.customerId == null || undefined) {
    throw new KnownError("Please select a valid customer for debit", 400)
  }
  else {
    remainingAmount = totalBillAmount - Number(data.paymentDetails.amount)
  }
  const isCustomerCheckout = Boolean(data.customerId)
  const entityType = isCustomerCheckout ? 'customer' : 'staff'
  const entityId = isCustomerCheckout ? data.customerId : data.staffId

  const existingEntity = await (
    isCustomerCheckout
      ? Database.client.hotelCustomer.findFirst({ where: { id: entityId } })
      : Database.client.hotelUserRel.findFirst({ where: { userId: entityId } })
  )

  if (!existingEntity) {
    throw new KnownError(`No ${entityType} with such information was found to checkout order from.`, 404)
  }

  const cashFlowData = {
    hotelId,
    userId,
    status: CashFlowStatus.NORMAL,
    category: data.paymentDetails.isChangeMoneyReturned ? CashFlowCategory.CREDIT : CashFlowCategory.DEBIT,
    amount: Number(data.paymentDetails.amount),
    paymentMethodId: data.paymentDetails.paymentMethodId,
    remarks: data.remarks ?? `Order check-out`
  }

  const cashFlow = await Database.client.cashFlow.create({
    data: cashFlowData,
    include: { paymentMethod: true, hotel: true, performedBy: true }
  })

  const transactionData = {
    transactionOf: isCustomerCheckout ? transactionOf.CUSTOMER : transactionOf.STAFF,
    isCredit: data.paymentDetails.isChangeMoneyReturned ? false : true,
    amount: Math.abs(remainingAmount),
    remarks: data.remarks,
    hotelId: hotelId,
    ...(isCustomerCheckout
      ? { customerId: entityId }
      : { staffId: entityId })
  }

  const transaction = await Database.client.transactions.create({
    data: transactionData,
    include: {
      hotel: {
        select: { name: true, address: true, primaryContact: true }
      },
      staff: { select: { name: true } },
      customer: { select: { name: true, balance: true } }
    }
  })

  if (isCustomerCheckout && 'balance' in existingEntity) {
    await Database.client.hotelCustomer.update({
      where: { id: entityId },
      data: {
        balance: existingEntity.balance + remainingAmount
      }
    })
  }

  if (!transaction) {
    throw new KnownError(`Failed to add transaction for ${entityType}`)
  }

  await Database.client.$transaction([
    Database.client.orders.update({
      where: { id: order.id },
      data: { isDeleted: true }
    }),
    Database.client.table.update({
      where: { id: String(order.tableId) },
      data: { status: "AVAILABLE" }
    })

  ])

  const responseData = {
    paymentMethod: cashFlow.paymentMethod.name,
    paidAmount: cashFlow.amount,
    credit: transaction,
    status: cashFlow.status,
    createdAt: cashFlow.createdAt,
    table: order.table?.name,
    room: order.room?.name,
    performedBy: cashFlow.performedBy.name
  }
  return responseData
}
