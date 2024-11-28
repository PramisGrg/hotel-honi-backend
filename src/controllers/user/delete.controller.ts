import type { Response, NextFunction } from "express";
import { SecureRequest } from "../../interfaces/general/request.interface";
import KnownError from "../../utils/knownError.utils";
import { deleteUserService } from "../../services/user/delete.service";

export async function deleteUserController(req: SecureRequest, res: Response, next: NextFunction) {
    try {
        if (!req.currentUser || !req.currentUser.id) {
            throw new KnownError('Unauthorized')
        }

        const response = await deleteUserService(req.currentUser.id);

        return res.status(200).json({ message: 'User deleted successfully.', data: response });
    } catch (error) {
        return next(error);
    }
}