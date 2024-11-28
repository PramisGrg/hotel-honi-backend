import { NextFunction, Response } from "express"
import { SecureRequest } from "../../../interfaces/general/request.interface"
import KnownError from "../../../utils/knownError.utils"
import { getAllTableService, getSingleTableService } from "../../../services/space/table/get.service"

export async function getAllTableController(req: SecureRequest, res: Response, next: NextFunction) {
  try {

    if (!req.currentUser || !req.currentUser.id) {
      throw new KnownError("You must be logged in to perform this action.", 403)
    }

    if (!req.currentUser.activeHotel) {
      throw new KnownError("Please switch to a hotel to perform this action.")
    }

    const response = await getAllTableService(req.currentUser.activeHotel, Number(req.query.take ?? 25), Number(req.query.skip ?? 0), String(req.query.search ?? ''));

    return res.status(200).json({ message: "Tables fetched successfully.", data: response });

  } catch (error) {
    return next(error)
  }
}

interface IGetSingleTableRequest extends SecureRequest {
  params: { tableId: string }
}
export async function getSingleTableController(req: IGetSingleTableRequest, res: Response, next: NextFunction) {
  try {

    if (!req.currentUser || !req.currentUser.id) {
      throw new KnownError("You must be logged in to perform this action.", 403)
    }

    if (!req.currentUser.activeHotel) {
      throw new KnownError("Please switch to a hotel to perform this action.")
    }

    const response = await getSingleTableService(req.params.tableId, req.currentUser.activeHotel);

    return res.status(200).json({ message: "Tables fetched successfully.", data: response })

  } catch (error) {
    return next(error)
  }
}
