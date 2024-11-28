import { transactionOf } from "@prisma/client";
import Database from "../../configs/db.config";

export async function getAllTransactionService(hotelId: string) {
  const existingTransactions = await Database.client.transactions.findMany({
    where: {
      hotelId,
    },
    include: {
      staff: true,
      customer: true,
      supplier: true
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  return existingTransactions;
}

export async function getTransactionService(hotelId: string, userId: string, transactionOff: transactionOf) {
  const whereCondition = {
    hotelId,
    ...(transactionOff === transactionOf.CUSTOMER ? { customerId: userId } :
      transactionOff === transactionOf.SUPPLIER ? { supplierId: userId } :
        transactionOff === transactionOf.STAFF ? { staffId: userId } : {})
  }

  const transactions = await Database.client.transactions.findMany({
    where: whereCondition,
    orderBy: {
      createdAt: 'desc'
    },
    include: {
      staff: true,
      customer: true,
      supplier: true
    }
  })

  return transactions
}