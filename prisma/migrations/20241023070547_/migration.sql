/*
  Warnings:

  - You are about to drop the `FoodMenu` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `hotelId` to the `Room` table without a default value. This is not possible if the table is not empty.
  - Added the required column `hotelId` to the `Space` table without a default value. This is not possible if the table is not empty.
  - Added the required column `hotelId` to the `Table` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "PrinterType" AS ENUM ('BLUETOOTH', 'NETWORK');

-- CreateEnum
CREATE TYPE "KotStatus" AS ENUM ('PENDING', 'PREPARING', 'SERVED', 'COMPLETED');

-- CreateEnum
CREATE TYPE "OrderType" AS ENUM ('ROOM', 'TABLE');

-- CreateEnum
CREATE TYPE "CashFlowCategory" AS ENUM ('SALES', 'CREDIT', 'DEBIT', 'TAX');

-- CreateEnum
CREATE TYPE "CashFlowStatus" AS ENUM ('NORMAL', 'ABORTED', 'VOID');

-- CreateEnum
CREATE TYPE "InvitationStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED');

-- DropForeignKey
ALTER TABLE "FoodMenu" DROP CONSTRAINT "FoodMenu_foodMenuCategoryId_fkey";

-- DropForeignKey
ALTER TABLE "FoodMenu" DROP CONSTRAINT "FoodMenu_hotelId_fkey";

-- DropForeignKey
ALTER TABLE "FoodMenu" DROP CONSTRAINT "FoodMenu_userId_fkey";

-- DropForeignKey
ALTER TABLE "Room" DROP CONSTRAINT "Room_spaceId_fkey";

-- DropForeignKey
ALTER TABLE "Table" DROP CONSTRAINT "Table_spaceId_fkey";

-- AlterTable
ALTER TABLE "FoodMenuCategory" ADD COLUMN     "image" TEXT;

-- AlterTable
ALTER TABLE "HotelCustomer" ADD COLUMN     "balance" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "email" TEXT;

-- AlterTable
ALTER TABLE "HotelSuppliers" ADD COLUMN     "balance" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "email" TEXT;

-- AlterTable
ALTER TABLE "Role" ADD COLUMN     "customName" TEXT,
ADD COLUMN     "hotelId" TEXT;

-- AlterTable
ALTER TABLE "Room" ADD COLUMN     "hotelId" TEXT NOT NULL,
ADD COLUMN     "images" TEXT[],
ALTER COLUMN "spaceId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Space" ADD COLUMN     "hotelId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Table" ADD COLUMN     "hotelId" TEXT NOT NULL,
ALTER COLUMN "spaceId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "hotel" ADD COLUMN     "serviceCharge" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "taxRate" DOUBLE PRECISION NOT NULL DEFAULT 13.00;

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "avatar" TEXT;

-- AlterTable
ALTER TABLE "websiteMetadata" ALTER COLUMN "description" DROP NOT NULL;

-- DropTable
DROP TABLE "FoodMenu";

-- CreateTable
CREATE TABLE "RecentLogins" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "loginToken" TEXT NOT NULL,
    "oneSignalId" TEXT NOT NULL,
    "deviceName" TEXT NOT NULL,
    "isBlacklisted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RecentLogins_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FoodMenuItem" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "image" TEXT,
    "description" TEXT NOT NULL DEFAULT '',
    "foodMenuCategoryId" TEXT,
    "hotelId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "kotId" TEXT,

    CONSTRAINT "FoodMenuItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Printer" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT '',
    "ipAddress" TEXT NOT NULL DEFAULT '',
    "type" "PrinterType" NOT NULL,
    "nickName" TEXT NOT NULL DEFAULT '',
    "hotelId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Printer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Kot" (
    "id" TEXT NOT NULL,
    "kotNumber" TEXT NOT NULL,
    "status" "KotStatus" NOT NULL,
    "type" "OrderType" NOT NULL,
    "orderForId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "hotelId" TEXT NOT NULL,
    "ordersId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Kot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "KotItems" (
    "id" TEXT NOT NULL,
    "foodMenuItemId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "kotId" TEXT NOT NULL,
    "status" "KotStatus" NOT NULL,

    CONSTRAINT "KotItems_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CashFlow" (
    "id" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "category" "CashFlowCategory" NOT NULL,
    "remarks" TEXT NOT NULL,
    "status" "CashFlowStatus" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,
    "hotelId" TEXT NOT NULL,

    CONSTRAINT "CashFlow_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Inventory" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "unit" TEXT NOT NULL,
    "image" TEXT,
    "description" TEXT,
    "hotelId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT,

    CONSTRAINT "Inventory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Orders" (
    "id" TEXT NOT NULL,
    "orderNumber" TEXT NOT NULL DEFAULT '1',
    "tableId" TEXT,
    "roomId" TEXT,
    "hotelId" TEXT NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StaffInvitations" (
    "id" TEXT NOT NULL,
    "role" "roleName",
    "userId" TEXT NOT NULL,
    "hotelId" TEXT NOT NULL,
    "status" "InvitationStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "roleId" TEXT,

    CONSTRAINT "StaffInvitations_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "RecentLogins" ADD CONSTRAINT "RecentLogins_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Role" ADD CONSTRAINT "Role_hotelId_fkey" FOREIGN KEY ("hotelId") REFERENCES "hotel"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Space" ADD CONSTRAINT "Space_hotelId_fkey" FOREIGN KEY ("hotelId") REFERENCES "hotel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Room" ADD CONSTRAINT "Room_spaceId_fkey" FOREIGN KEY ("spaceId") REFERENCES "Space"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Room" ADD CONSTRAINT "Room_hotelId_fkey" FOREIGN KEY ("hotelId") REFERENCES "hotel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Table" ADD CONSTRAINT "Table_spaceId_fkey" FOREIGN KEY ("spaceId") REFERENCES "Space"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Table" ADD CONSTRAINT "Table_hotelId_fkey" FOREIGN KEY ("hotelId") REFERENCES "hotel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FoodMenuItem" ADD CONSTRAINT "FoodMenuItem_foodMenuCategoryId_fkey" FOREIGN KEY ("foodMenuCategoryId") REFERENCES "FoodMenuCategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FoodMenuItem" ADD CONSTRAINT "FoodMenuItem_hotelId_fkey" FOREIGN KEY ("hotelId") REFERENCES "hotel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FoodMenuItem" ADD CONSTRAINT "FoodMenuItem_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FoodMenuItem" ADD CONSTRAINT "FoodMenuItem_kotId_fkey" FOREIGN KEY ("kotId") REFERENCES "Kot"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Printer" ADD CONSTRAINT "Printer_hotelId_fkey" FOREIGN KEY ("hotelId") REFERENCES "hotel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Kot" ADD CONSTRAINT "Kot_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Kot" ADD CONSTRAINT "Kot_hotelId_fkey" FOREIGN KEY ("hotelId") REFERENCES "hotel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Kot" ADD CONSTRAINT "Kot_ordersId_fkey" FOREIGN KEY ("ordersId") REFERENCES "Orders"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KotItems" ADD CONSTRAINT "KotItems_foodMenuItemId_fkey" FOREIGN KEY ("foodMenuItemId") REFERENCES "FoodMenuItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KotItems" ADD CONSTRAINT "KotItems_kotId_fkey" FOREIGN KEY ("kotId") REFERENCES "Kot"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CashFlow" ADD CONSTRAINT "CashFlow_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CashFlow" ADD CONSTRAINT "CashFlow_hotelId_fkey" FOREIGN KEY ("hotelId") REFERENCES "hotel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Inventory" ADD CONSTRAINT "Inventory_hotelId_fkey" FOREIGN KEY ("hotelId") REFERENCES "hotel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Inventory" ADD CONSTRAINT "Inventory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Orders" ADD CONSTRAINT "Orders_tableId_fkey" FOREIGN KEY ("tableId") REFERENCES "Table"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Orders" ADD CONSTRAINT "Orders_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Orders" ADD CONSTRAINT "Orders_hotelId_fkey" FOREIGN KEY ("hotelId") REFERENCES "hotel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StaffInvitations" ADD CONSTRAINT "StaffInvitations_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StaffInvitations" ADD CONSTRAINT "StaffInvitations_hotelId_fkey" FOREIGN KEY ("hotelId") REFERENCES "hotel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StaffInvitations" ADD CONSTRAINT "StaffInvitations_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE SET NULL ON UPDATE CASCADE;
