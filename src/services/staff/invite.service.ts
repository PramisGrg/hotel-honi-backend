import { InvitationStatus } from "@prisma/client";
import Database from "../../configs/db.config";
import { TInvitationActionSchema, TInviteStaffSchema, TUpdateInviteStaffSchema } from "../../schema/staff/invite.schema";
import KnownError from "../../utils/knownError.utils";

export async function inviteStaffService(hotelId: string, userId: string, data: TInviteStaffSchema) {
  const invitingStaff = await Database.client.user.findFirst({ where: { dialCode: data.dialCode, phoneNumber: data.phoneNumber } });

  if (!invitingStaff) {
    throw new KnownError('No user with such phone number to invite staff', 404);
  }

  if (data.role.type == "SUPERADMIN") {
    throw new KnownError('You can not have multiple superadmins in a single system, please try transfering superadmin role.')
  }

  const existingInvitation = await Database.client.staffInvitations.findFirst({ where: { userId: invitingStaff.id } });
  if (existingInvitation?.role && existingInvitation.status === InvitationStatus.PENDING) {
    throw new KnownError(`User with such phone number is already invited as ${existingInvitation.role.toString().toLowerCase()}.`);
  } else if (existingInvitation?.role && existingInvitation.status === InvitationStatus.ACCEPTED) {
    throw new KnownError(`User with such phone number is already a staff as ${existingInvitation.role.toString().toLowerCase()}.`);
  }

  const newInvitation = await Database.client.staffInvitations.create({
    data: {
      userId: invitingStaff.id,
      roleId: data.role.id,
      role: data.role.type,
      hotelId
    }
  });

  return newInvitation;
}

export async function updateInviteStaffService(hotelId: string, userId: string, data: TUpdateInviteStaffSchema) {

  const invitationDetail = await Database.client.staffInvitations.findFirst({ where: { id: data.invitationId } });

  if (!invitationDetail) {
    throw new KnownError('No such invitation found', 404);
  }
  if (!data.role) throw new KnownError('Please provide a valid role to update invitation.');

  if (data.role.type == "SUPERADMIN") {
    throw new KnownError('You can not have multiple superadmins in a single system, please try transfering superadmin role.')
  }

  const updatedInvitation = await Database.client.staffInvitations.update({
    where: { id: invitationDetail.id },
    data: {
      roleId: data.role.id,
      role: data.role.type,
    },
    select: {
      id: true,
      hotel: {
        select: { id: true, name: true }
      },
      role: true,
      roleId: true,
      user: {
        select: {
          id: true, name: true, dialCode: true, phoneNumber: true
        },

      },
      status: true,
    }
  });
  return updatedInvitation;
}

export async function inviteStaffActionService(userId: string, data: TInvitationActionSchema) {
  //todo: this kind of activity must be done in a transaction.
  // const response = await Database.client.$transaction([])
  const existingInvitation = await Database.client.staffInvitations.findFirst({
    where: { id: data.invitationId },
    select: {
      id: true,
      userId: true,
      roleId: true,
      hotel: {
        select: { id: true, name: true }
      }
    }
  });
  if (!existingInvitation || !existingInvitation.roleId) {
    throw new KnownError('Invitation to accept was not found, please ask your owner to invite again.', 404)
  }
  if (existingInvitation.userId !== userId) {
    throw new KnownError('This invitation is not for you!', 401)
  }

  if (data.status === 'REJECTED') {
    const rejectedInvitation = await Database.client.staffInvitations.update({ where: { id: data.invitationId }, data: { status: 'REJECTED' } });
    if (!rejectedInvitation) {
      throw new KnownError('Oops! something went wrong, please try again later.', 500)
    }
    return rejectedInvitation
  } else if (data.status === 'ACCEPTED') {
    const newHotelStaffRel = await Database.client.hotelUserRel.create({
      data: {
        hotelId: existingInvitation.hotel.id,
        userId: existingInvitation.userId,
        roleId: existingInvitation.roleId
      }
    })
    if (!newHotelStaffRel) {
      throw new KnownError('Failed to accept staff invitation.', 500)
    }
    await Database.client.staffInvitations.update({ where: { id: data.invitationId }, data: { status: 'ACCEPTED' } });
    await Database.client.user.update({ where: { id: existingInvitation.userId }, data: { activeHotelId: existingInvitation.hotel.id } });
    return newHotelStaffRel
  }
}
