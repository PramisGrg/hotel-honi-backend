import { CashFlowCategory, CashFlowStatus, transactionOf } from "@prisma/client";
import Database from "../../configs/db.config";
import { TCreateTransactionSchema } from "../../schema/transaction/create.schema";
import KnownError from "../../utils/knownError.utils";

export async function createTransactionService(data: TCreateTransactionSchema, hotelId: string, userId: string) {
  // Input validation
  if (data.transactionOf !== transactionOf.CUSTOMER) {
    throw new KnownError('NOT IMPLEMENTED', 501);
  }

  const existingCustomer = await Database.client.hotelCustomer.findFirst({
    where: { id: data.userId, hotelId }
  });

  if (!existingCustomer) {
    throw new KnownError("Customer not found", 404);
  }

  const paymentAmount = data.paymentDetails.amount;
  let cashFlowData;
  let newBalance: number = 0;

  // Calculate new balance based on transaction type
  if (data.transactionType === "IN") {
    newBalance = existingCustomer.balance - paymentAmount;

    if (newBalance > 0) {
      // Partial payment received
      cashFlowData = {
        hotelId,
        userId,
        status: CashFlowStatus.NORMAL,
        category: CashFlowCategory.CREDIT,
        amount: paymentAmount,
        paymentMethodId: data.paymentDetails.paymentMethodId,
        remarks: data.remarks ?? `Partial credit paid by customer`
      };
    } else if (newBalance === 0) {
      // Full payment received
      cashFlowData = {
        hotelId,
        userId,
        status: CashFlowStatus.NORMAL,
        category: CashFlowCategory.SALES,
        amount: paymentAmount,
        paymentMethodId: data.paymentDetails.paymentMethodId,
        remarks: data.remarks ?? `Credit paid by customer`
      };
    } else {
      // Overpayment case
      if (data.paymentDetails.isChangeMoneyReturned) {
        cashFlowData = {
          hotelId,
          userId,
          status: CashFlowStatus.NORMAL,
          category: CashFlowCategory.SALES,
          amount: existingCustomer.balance, // Only process the amount needed to clear the balance
          paymentMethodId: data.paymentDetails.paymentMethodId,
          remarks: data.remarks ?? `Credit fully paid by customer`
        };
        newBalance = 0;
      } else {
        cashFlowData = {
          hotelId,
          userId,
          status: CashFlowStatus.NORMAL,
          category: CashFlowCategory.DEBIT,
          amount: paymentAmount,
          paymentMethodId: data.paymentDetails.paymentMethodId,
          remarks: data.remarks ?? `Advance payment by customer`
        };
      }
    }
  } else if (data.transactionType === "OUT") {
    if (data.paymentDetails.isChangeMoneyReturned) {
      // Calculate actual amount that needs to be given based on customer balance
      const actualAmount = Math.abs(existingCustomer.balance);
      const returnAmount = paymentAmount - actualAmount;

      // Set new balance to 0 since we're clearing the debt
      newBalance = 0;

      // Create two cash flow entries: one for giving money and one for receiving change
      const givingMoneyCashFlow = await Database.client.cashFlow.create({
        data: {
          hotelId,
          userId,
          status: CashFlowStatus.NORMAL,
          category: CashFlowCategory.DEBIT,
          amount: paymentAmount,
          paymentMethodId: data.paymentDetails.paymentMethodId,
          remarks: data.remarks ?? `Money given to customer`
        }
      });

      // Record the change returned by customer
      await Database.client.cashFlow.create({
        data: {
          hotelId,
          userId,
          status: CashFlowStatus.NORMAL,
          category: CashFlowCategory.CREDIT,
          amount: returnAmount,
          paymentMethodId: data.paymentDetails.paymentMethodId,
          remarks: `Change returned by customer`
        }
      });

      // Update customer balance
      await Database.client.hotelCustomer.update({
        where: { id: data.userId },
        data: { balance: newBalance }
      });

      // Create transaction record
      const transaction = await Database.client.transactions.create({
        data: {
          transactionOf: data.transactionOf,
          customerId: data.transactionOf === transactionOf.CUSTOMER ? data.userId : undefined,
          isCredit: data.isCredit,
          amount: actualAmount, // Use the actual amount that was needed
          remarks: data.remarks,
          hotelId,
        }
      });

      return givingMoneyCashFlow;
    }

    // Normal OUT transaction cases
    newBalance = existingCustomer.balance + paymentAmount;

    if (newBalance > 0) {
      cashFlowData = {
        hotelId,
        userId,
        status: CashFlowStatus.NORMAL,
        category: CashFlowCategory.CREDIT,
        amount: paymentAmount,
        paymentMethodId: data.paymentDetails.paymentMethodId,
        remarks: data.remarks ?? `Credit given to customer`
      };
    } else if (newBalance === 0) {
      cashFlowData = {
        hotelId,
        userId,
        status: CashFlowStatus.NORMAL,
        category: CashFlowCategory.DEBIT,
        amount: paymentAmount,
        paymentMethodId: data.paymentDetails.paymentMethodId,
        remarks: data.remarks ?? `Full amount paid to customer`
      };
    }
  }

  if (cashFlowData === undefined) {
    throw new KnownError("Invalid transaction type", 400);
  }

  // Update customer balance
  await Database.client.hotelCustomer.update({
    where: { id: data.userId },
    data: { balance: newBalance }
  });

  // Create transaction record
  const transaction = await Database.client.transactions.create({
    data: {
      transactionOf: data.transactionOf,
      customerId: data.transactionOf === transactionOf.CUSTOMER ? data.userId : undefined,
      isCredit: data.isCredit,
      amount: paymentAmount,
      remarks: data.remarks,
      hotelId,
    }
  });

  // Create cash flow record
  const cashFlow = await Database.client.cashFlow.create({
    data: cashFlowData
  });

  return cashFlow;
}