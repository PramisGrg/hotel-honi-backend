import { roleName } from "@prisma/client";
import Database from "../../configs/db.config";
import { TCreateRoleSchema } from "../../schema/role/create.schema";
import KnownError from "../../utils/knownError.utils";

export async function createRoleService(data: TCreateRoleSchema, hotelId: string, userId: string) {
  const createdRole = await Database.client.role.create({
    data: {
      customName: data.customName,
      name: roleName.CUSTOM,
      permissions: data.permissions,
      hotelId,
    }
  })

  if (!createdRole) {
    throw new KnownError('Failed to create role. Please try again.')
  }

  return createdRole
}