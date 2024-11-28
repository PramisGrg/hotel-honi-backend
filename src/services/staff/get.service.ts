import Database from "../../configs/db.config";

export async function getAllStaffService(hotelId: string) {
  const existingStaff = await Database.client.hotelUserRel.findMany({
    where: { hotelId }, select: {
      user: {
        select: { id: true, name: true, dialCode: true, phoneNumber: true }
      },
      role: {
        select: { id: true, name: true }
      }
    },
    orderBy: { createdAt: "desc" }
  });

  return existingStaff;
}
