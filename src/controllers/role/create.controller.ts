import type { Response, NextFunction } from "express";
import { SecureRequest } from "../../interfaces/general/request.interface";
import KnownError from "../../utils/knownError.utils";
import { TCreateRoleSchema } from "../../schema/role/create.schema";
import { createRoleService } from "../../services/role/create.service";

interface ICreateRoleRequest extends SecureRequest {
  body: TCreateRoleSchema
}

export async function createRoleController(req: ICreateRoleRequest, res: Response, next: NextFunction) {
  try {
    if (!req.currentUser || !req.currentUser.id) {
      throw new KnownError('You must be logged in to perform this action.', 403);
    }
    if (!req.currentUser.activeHotel) {
      throw new KnownError('Please switch to a hotel to perform this action.')
    }
    const response = await createRoleService(req.body, req.currentUser.activeHotel, req.currentUser.id);

    return res.status(200).json({ message: "Role created successfully.", data: response })

  } catch (error) {
    return next(error)
  }
}