import type { Response, NextFunction } from "express";
import { SecureRequest } from "../../interfaces/general/request.interface";
import KnownError from "../../utils/knownError.utils";
import { TUpdateRoleSchema } from "../../schema/role/update.schema";
import { updateRoleService } from "../../services/role/update.service";

interface IUpdateRoleRequest extends SecureRequest {
  body: TUpdateRoleSchema,
  params: {
    roleId: string
  }
}

export async function updateRoleController(req: IUpdateRoleRequest, res: Response, next: NextFunction) {
  try {
    if (!req.currentUser || !req.currentUser.id) {
      throw new KnownError('You must be logged in to perform this action.', 403);
    }
    if (!req.currentUser.activeHotel) {
      throw new KnownError('Please switch to a hotel to perform this action.')
    }
    const response = await updateRoleService(req.body, req.params.roleId, req.currentUser.id);
    return res.status(200).json({ message: "Role updated successfully.", data: response })
  }
  catch (error) {
    return next(error)
  }
}