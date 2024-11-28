import Database from "../../configs/db.config"
import KnownError from "../../utils/knownError.utils"

export async function getUserService(userId: string) {
  const existingUser = await Database.client.user.findFirst({
    where: {
      id: userId
    }
  })

  if (!existingUser) {
    throw new KnownError("User id does not exist.")
  }
  const refinedUser = { ...existingUser, otpHash: undefined, passwordHash: undefined }
  return refinedUser
}

export async function getAllHotelInvitationsService(userId: string) {
  const existingInvitations = await Database.client.staffInvitations.findMany({ where: { userId } });
  return existingInvitations;
}
