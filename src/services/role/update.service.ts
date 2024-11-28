import { roleName } from "@prisma/client";
import Database from "../../configs/db.config";
import KnownError from "../../utils/knownError.utils";
import { TUpdateRoleSchema } from "../../schema/role/update.schema";

export async function updateRoleService(data: TUpdateRoleSchema, roleId: string, _userId: string) {

  const updatedRole = await Database.client.role.update({
    where: {
      id: roleId
    },
    data: {
      customName: data.customName,
      permissions: data.permissions,
    }
  })

  if (!updatedRole) {
    throw new KnownError('Failed to update role. Please try again.')
  }

  return updatedRole
}