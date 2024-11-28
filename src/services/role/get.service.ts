import Database from "../../configs/db.config";

export async function getAllRoleService(hotelId: string) {
  const allRoles = await Database.client.role.findMany({
    where: {
      hotelId: hotelId
    },
    select: {
      id: true,
      name: true,
      customName: true,
      permissions: true,
      createdAt: true,
      updatedAt: true
    }
  });

  return allRoles;
}