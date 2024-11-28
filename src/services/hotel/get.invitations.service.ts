import { InvitationStatus } from "@prisma/client";
import Database from "../../configs/db.config";

export async function getInvitationsService(hotelId: string) {
  const existingInvitations = await Database.client.staffInvitations.findMany({
    where: {
      hotelId, status: {
        notIn: ["ACCEPTED", "REJECTED"]
      }
    },
    select: {
      id: true,
      role: true,
      roleId: true,
      Role: { select: { id: true, name: true } },
      status: true,
      user: {
        select: { name: true, id: true, dialCode: true, phoneNumber: true },
      },
      createdAt: true,
      updatedAt: true
    }, orderBy: { createdAt: "desc" }
  });
  return existingInvitations;
}
