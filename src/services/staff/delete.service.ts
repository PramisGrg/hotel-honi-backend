import { date } from "zod";
import Database from "../../configs/db.config";
import KnownError from "../../utils/knownError.utils";

export async function deleteStaffInvitationService(invitationId: string, hotelId: string) {
  const deletedStaffInvitation = await Database.client.staffInvitations.delete({
    where: { id: invitationId, hotelId, status: "PENDING" }
  });
  if (!deletedStaffInvitation) { throw new KnownError('Staff invitation not found.', 404) }
  return deletedStaffInvitation
}

export async function deleteStaffService(staffId: string, hotelId: string, _userId: string) {

  const existingHotelUserRel = await Database.client.hotelUserRel.findFirst({
    where: {
      userId: staffId,
      hotelId
    }
  })
  if (!existingHotelUserRel) { throw new KnownError('Staff not found.', 404) }

  const deletedStaff = await Database.client.hotelUserRel.delete({
    where: {
      id: existingHotelUserRel.id
    }
  })
  const staffInvitation = await Database.client.staffInvitations.findFirst({
    where: {
      userId: deletedStaff.userId,
      hotelId,
      status: "ACCEPTED"
    }
  })
  if (staffInvitation) {
    await Database.client.staffInvitations.delete({
      where: {
        id: staffInvitation.id
      }
    })
  }
  return deletedStaff
}