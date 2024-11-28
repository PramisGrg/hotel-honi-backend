import Database from "../../configs/db.config";
import { TCreateBillingInformationSchema, TUpdateBillingInformationSchema } from "../../schema/hotel/billingInformation.schema";
import KnownError from "../../utils/knownError.utils";

export async function getBillingInformationService(hotelId: string) {
  const existingBillingInformation = await Database.client.billingInformation.findFirst({
    where: { hotelId }
  })
  if (!existingBillingInformation) {
    throw new KnownError('No billing information found, please create one.', 404);
  }

  return existingBillingInformation
}


export async function createBillingInformationService(data: TCreateBillingInformationSchema, hotelId: string, userId: string) {
  const existingBillingInformation = await Database.client.billingInformation.findFirst({
    where: {
      hotelId
    }
  });
  if (existingBillingInformation) {
    throw new KnownError('Billing information already exists for this hotel, please update it rather than creating new.', 400);
  }
  const newBillingInformation = await Database.client.billingInformation.create({
    data: {
      serviceCharge: data.serviceCharge,
      serviceChargeType: data.serviceChargeType,
      taxRate: data.taxRate,
      hotelId
    }
  });

  return newBillingInformation
}


export async function updateBillingInformationService(data: TUpdateBillingInformationSchema, hotelId: string, userId: string) {
  const existingBillingInformation = await Database.client.billingInformation.findFirst({ where: { hotelId } });
  if (!existingBillingInformation) {
    throw new KnownError('No billing information with provided id found.', 404);
  }

  if (existingBillingInformation.serviceChargeType == "PERCENTAGE" && data.serviceCharge && data.serviceCharge > 100 && !data.serviceChargeType) {
    throw new KnownError('Service charge percentage cannot be more than 100.', 400);
  }

  const updatedBillingInformation = await Database.client.billingInformation.update({
    where: { id: existingBillingInformation.id },
    data: {
      serviceCharge: data.serviceCharge,
      serviceChargeType: data.serviceChargeType,
      taxRate: data.taxRate
    }
  })

  return updatedBillingInformation
}