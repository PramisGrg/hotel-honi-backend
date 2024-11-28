import { NextFunction, Response } from "express"
import { SecureRequest } from "../../../interfaces/general/request.interface"
import { TCreateTableSchema } from "../../../schema/space/table/create.schema"
import KnownError from "../../../utils/knownError.utils"
import { createTableService } from "../../../services/space/table/create.service"

interface ICreateTableRequest extends SecureRequest {
  body: TCreateTableSchema
}
export async function createTableController(req: ICreateTableRequest, res: Response, next: NextFunction) {
  try {
    if (!req.currentUser || !req.currentUser.id) {
      throw new KnownError("You must be logged in to perform this activity.", 403)
    }
    if (!req.currentUser.activeHotel) {
      throw new KnownError("Please switch to a hotel to perform this activity.")
    }
    const response = await createTableService(req.body, req.currentUser.id, req.currentUser.activeHotel)
    return res.status(200).json({ message: "Table created successfully.", data: response })
  } catch (error) {
    return next(error)
  }
}
