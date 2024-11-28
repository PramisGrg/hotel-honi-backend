
import { NextFunction, Response } from "express";
import { SecureRequest } from "../../../interfaces/general/request.interface";
import KnownError from "../../../utils/knownError.utils";
import { deleteTableService } from "../../../services/space/table/delete.service";


interface IDeleteTableRequest extends SecureRequest {
  params: { tableId: string }
}
export async function deleteTableController(req: IDeleteTableRequest, res: Response, next: NextFunction) {
  try {

    if (!req.currentUser || !req.currentUser.id) {
      throw new KnownError('You must be logged in to perform this activity.', 403);
    }

    if (!req.currentUser.activeHotel) {
      throw new KnownError('Please switch to a active hotel to perform this activity.')
    }

    const response = await deleteTableService(req.params.tableId, req.currentUser?.activeHotel, req.currentUser.id)

    return res.status(200).json({ message: "Table deleted successfully.", data: response })
  } catch (error) {
    return next(error);
  }
}
