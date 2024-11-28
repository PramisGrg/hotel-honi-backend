import Database from "../../configs/db.config"
import KnownError from "../../utils/knownError.utils"

export async function deleteRoleService(roleId: string, hotelId: string, _userId: string) {
  const deletedRole = await Database.client.role.delete({
    where: {
      id: roleId,
      hotelId
    }
  })

  if (!deletedRole) {
    throw new KnownError('Failed to delete role. Please try again.')
  }

  return deletedRole
}