import { NextFunction, Response } from "express";
import { SecureRequest } from "../../../interfaces/general/request.interface";
import { TUpdateTableSchema } from "../../../schema/space/table/update.schema";
import KnownError from "../../../utils/knownError.utils";
import { updateTableService } from "../../../services/space/table/update.service";


interface IUpdateTableRequest extends SecureRequest {
  body: TUpdateTableSchema
  params: { tableId: string }
}
export async function updateTableController(req: IUpdateTableRequest, res: Response, next: NextFunction) {
  try {
    if (!req.currentUser || !req.currentUser.id) {
      throw new KnownError("You must be logged in to perform this activity.", 403)
    }
    if (!req.currentUser.activeHotel) {
      throw new KnownError("Please switch to a hotel to perform this activity.")
    }
    const response = await updateTableService(req.body, req.params.tableId, req.currentUser.id, req.currentUser.activeHotel);
    return res.status(200).json({ message: "Table updated successfully.", data: response });
  } catch (error) {
    return next(error)
  }
}
