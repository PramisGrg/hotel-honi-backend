import type { Response, NextFunction } from "express";
import { SecureRequest } from "../../interfaces/general/request.interface";
import KnownError from "../../utils/knownError.utils";
import { deleteRoleService } from "../../services/role/delete.service";

interface IDeleteRoleRequest extends SecureRequest {
  params: {
    roleId: string
  }
}

export async function deleteRoleController(req: IDeleteRoleRequest, res: Response, next: NextFunction) {
  try {
    if (!req.currentUser || !req.currentUser.id) {
      throw new KnownError('You must be logged in to perform this action.', 403);
    }
    if (!req.currentUser.activeHotel) {
      throw new KnownError('Please switch to a hotel to perform this action.')
    }
    const response = await deleteRoleService(req.params.roleId, req.currentUser.activeHotel, req.currentUser.id);
    return res.status(200).json({ message: "Role deleted successfully.", data: response })
  } catch (error) {
    return next(error)
  }
}