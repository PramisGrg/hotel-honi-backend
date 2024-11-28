import Database from "../../configs/db.config";
import KnownError from "../../utils/knownError.utils";

export async function getUserInvitationService(userId: string, invitationId: string) {
  const existingInvitation = await Database.client.staffInvitations.findFirst({ where: { userId, id: invitationId } })
  if (!existingInvitation) {
    throw new KnownError('No such invitation found', 404);
  }
  return existingInvitation;
}

export async function getAllUserInvitationsService(userId: string) {
  const existingInvitations = await Database.client.staffInvitations.findMany({
    where: { userId },
    select: {
      id: true,
      role: true,
      status: true,
      hotel: { select: { name: true, id: true } },
      createdAt: true,
      updatedAt: true
    }, orderBy: { createdAt: 'desc' }
  })
  return existingInvitations;
}