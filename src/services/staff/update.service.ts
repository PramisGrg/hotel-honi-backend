import Database from "../../configs/db.config";
import { TUpdateStaffSchema } from "../../schema/staff/update.schema";
import KnownError from "../../utils/knownError.utils";

export async function updateStaffService(data: TUpdateStaffSchema, hotelId: string) {
  const existingStaffRel = await Database.client.hotelUserRel.findFirst({
    where: { userId: data.staffId, hotelId },
  });
  if (!existingStaffRel) throw new KnownError('No such staff found', 404);

  const updatedStaff = await Database.client.hotelUserRel.update({
    where: { id: existingStaffRel.id },
    data: {
      roleId: data.role.id,
    }
  })

  if (!updatedStaff) throw new KnownError('No such staff found', 404);
  return updatedStaff;
}