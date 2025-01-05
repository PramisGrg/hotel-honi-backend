/*
  Warnings:

  - The values [COMPLETED] on the enum `KotStatus` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `serviceCharge` on the `hotel` table. All the data in the column will be lost.
  - You are about to drop the column `taxRate` on the `hotel` table. All the data in the column will be lost.
  - Added the required column `paymentMethodId` to the `CashFlow` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `Orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Orders` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "serviceChargeType" AS ENUM ('PERCENTAGE', 'NUMBER');

-- CreateEnum
CREATE TYPE "PurchaseOrderStatus" AS ENUM ('PENDING', 'ISAPROOVED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "transactionOf" AS ENUM ('CUSTOMER', 'SUPPLIER', 'STAFF');

-- AlterEnum
BEGIN;
CREATE TYPE "KotStatus_new" AS ENUM ('PENDING', 'PREPARING', 'SERVED', 'CANCELLED');
ALTER TABLE "Orders" ALTER COLUMN "status" TYPE "KotStatus_new" USING ("status"::text::"KotStatus_new");
ALTER TABLE "Kot" ALTER COLUMN "status" TYPE "KotStatus_new" USING ("status"::text::"KotStatus_new");
ALTER TABLE "KotItems" ALTER COLUMN "status" TYPE "KotStatus_new" USING ("status"::text::"KotStatus_new");
ALTER TYPE "KotStatus" RENAME TO "KotStatus_old";
ALTER TYPE "KotStatus_new" RENAME TO "KotStatus";
DROP TYPE "KotStatus_old";
COMMIT;

-- AlterTable
ALTER TABLE "CashFlow" ADD COLUMN     "paymentMethodId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Inventory" ADD COLUMN     "price" DOUBLE PRECISION NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Kot" ALTER COLUMN "status" SET DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE "KotItems" ALTER COLUMN "status" SET DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE "Orders" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "status" "KotStatus" NOT NULL DEFAULT 'PENDING',
ADD COLUMN     "type" "OrderType" NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "hotel" DROP COLUMN "serviceCharge",
DROP COLUMN "taxRate";

-- AlterTable
ALTER TABLE "websiteMetadata" ADD COLUMN     "websiteThemesId" TEXT;

-- CreateTable
CREATE TABLE "BillingInformation" (
    "id" TEXT NOT NULL,
    "taxRate" DOUBLE PRECISION NOT NULL DEFAULT 13.00,
    "serviceCharge" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "serviceChargeType" "serviceChargeType" NOT NULL,
    "hotelId" TEXT NOT NULL,

    CONSTRAINT "BillingInformation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PurchaseOrder" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "isCustomItem" BOOLEAN NOT NULL DEFAULT false,
    "quantity" INTEGER NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "status" "PurchaseOrderStatus" NOT NULL DEFAULT 'PENDING',
    "inventoryId" TEXT,
    "staffId" TEXT,
    "supplierId" TEXT,
    "remarks" TEXT,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "hotelId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PurchaseOrder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "paymentMethods" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "remarks" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "hotelId" TEXT NOT NULL,

    CONSTRAINT "paymentMethods_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "websiteThemes" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "vercelProjectId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "websiteThemes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Transactions" (
    "id" TEXT NOT NULL,
    "customerId" TEXT,
    "supplierId" TEXT,
    "staffId" TEXT,
    "transactionOf" "transactionOf" NOT NULL,
    "isCredit" BOOLEAN NOT NULL DEFAULT false,
    "amount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "remarks" TEXT DEFAULT '',
    "hotelId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Transactions_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "BillingInformation" ADD CONSTRAINT "BillingInformation_hotelId_fkey" FOREIGN KEY ("hotelId") REFERENCES "hotel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "websiteMetadata" ADD CONSTRAINT "websiteMetadata_websiteThemesId_fkey" FOREIGN KEY ("websiteThemesId") REFERENCES "websiteThemes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CashFlow" ADD CONSTRAINT "CashFlow_paymentMethodId_fkey" FOREIGN KEY ("paymentMethodId") REFERENCES "paymentMethods"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PurchaseOrder" ADD CONSTRAINT "PurchaseOrder_inventoryId_fkey" FOREIGN KEY ("inventoryId") REFERENCES "Inventory"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PurchaseOrder" ADD CONSTRAINT "PurchaseOrder_staffId_fkey" FOREIGN KEY ("staffId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PurchaseOrder" ADD CONSTRAINT "PurchaseOrder_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "HotelSuppliers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PurchaseOrder" ADD CONSTRAINT "PurchaseOrder_hotelId_fkey" FOREIGN KEY ("hotelId") REFERENCES "hotel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "paymentMethods" ADD CONSTRAINT "paymentMethods_hotelId_fkey" FOREIGN KEY ("hotelId") REFERENCES "hotel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transactions" ADD CONSTRAINT "Transactions_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "HotelCustomer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transactions" ADD CONSTRAINT "Transactions_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "HotelSuppliers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transactions" ADD CONSTRAINT "Transactions_staffId_fkey" FOREIGN KEY ("staffId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transactions" ADD CONSTRAINT "Transactions_hotelId_fkey" FOREIGN KEY ("hotelId") REFERENCES "hotel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
