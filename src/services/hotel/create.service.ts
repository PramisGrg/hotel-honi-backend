import { roleName } from "@prisma/client"
import Database from "../../configs/db.config"
import { generateRole, SuperAdminRole } from "../../configs/defaultRoles.config"
import { SecureRequestUserData } from "../../interfaces/general/request.interface"
import { TCreateHotel } from "../../schema/hotel/create.schema"
import { generateToken } from "../../utils/generateToken.utils"
import KnownError from "../../utils/knownError.utils"
import { defaultFoodCategory } from "../../configs/defaultFoodCategory.config"
import { defaultPaymentMethod } from "../../configs/defaultPaymentMethod.config"

export async function createHotelService(data: TCreateHotel, userId: string) {
  const existingUser = await Database.client.user.findFirst({
    where: {
      id: userId
    },
    select: {
      id: true,
      name: true,
      dialCode: true,
      phoneNumber: true
    }
  })

  if (!existingUser) {
    throw new KnownError("Sorry, the provided user is invalid.")
  }

  const hotel = await Database.client.hotel.create({
    data: {
      name: data.name,
      primaryContact: data.primaryContact,
      address: data.address
    }
  })

  const hotelSuperadminRole = await Database.client.role.create({
    data: {
      name: SuperAdminRole.name,
      permissions: SuperAdminRole.permissions,
      hotelId: hotel.id,
      HotelUserRel: {
        create: {
          hotelId: hotel.id,
          userId: userId
        }
      }
    }
  })

  const roles = generateRole()

  for (let i = 1; i < roles.length; i++) {
    await Database.client.role.create({
      data: {
        name: roles[i].name as roleName,
        permissions: roles[i].permissions,
        hotelId: hotel.id
      }
    })
  }

  for (let i = 0; i < defaultFoodCategory.length; i++) {
    await Database.client.foodMenuCategory.create({
      data: {
        name: defaultFoodCategory[i],
        hotelId: hotel.id,
        userId: userId,
        isDefault: true
      }
    })
  }

  // for (let i = 0; i < defaultPaymentMethod.length; i++) {
  //   await Database.client.paymentMethods.create({
  //     data: {
  //       name: defaultPaymentMethod[i],
  //       hotelId: hotel.id,
  //       remarks: "Default Payment Method",
  //     }
  //   });
  // }

  // await Database.client.billingInformation.create({
  //   data: {
  //     serviceCharge: 0,
  //     serviceChargeType: "PERCENTAGE",
  //     taxRate: 13,
  //     hotelId: hotel.id
  //   }
  // });

  await Database.client.user.update({ where: { id: userId }, data: { activeHotelId: hotel.id } })

  const newTokenPayload: SecureRequestUserData = {
    ...existingUser,
    activeHotel: hotel.id,
    permissions: SuperAdminRole.permissions,
    roleId: hotelSuperadminRole.id,
    roleName: hotelSuperadminRole.name
  }

  const token = await generateToken(newTokenPayload, "30d")

  return { token, hotel }
}
