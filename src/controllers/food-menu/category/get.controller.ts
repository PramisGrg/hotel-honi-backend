import type { Response, NextFunction } from "express"
import { SecureRequest } from "../../../interfaces/general/request.interface"
import KnownError from "../../../utils/knownError.utils"
import {
  getAllFoodMenuCategoryService,
  getSingleFoodMenuCategoryService
} from "../../../services/food-menu/category/get.service"


export async function getAllFoodMenuCategoryController(
  req: SecureRequest,
  res: Response,
  next: NextFunction
) {
  try {
    if (!req.currentUser || !req.currentUser.id) {
      throw new KnownError("You must be logged in to perform this action", 403)
    }
    if (!req.currentUser.activeHotel) {
      throw new KnownError("Please switch to a hotel to perform this action")
    }
    const response = await getAllFoodMenuCategoryService(
      req.currentUser.activeHotel,
      Number(req.query.take ?? 25),
      Number(req.query.skip ?? 0),
      String(req.query.search ?? "")
    )
    return res.status(200).json({ message: "All food menu category data fetched successfully", data: response })
  } catch (error) {
    return next(error)
  }
}

export async function getSingleFoodMenuCategoryController(
  req: SecureRequest,
  res: Response,
  next: NextFunction
) {
  try {
    if (!req.currentUser || !req.currentUser.id) {
      throw new KnownError("You must be logged in to perform this action", 403)
    }
    if (!req.currentUser.activeHotel) {
      throw new KnownError("Please switch to a hotel to perform this action")
    }
    const userId = req.currentUser.id
    const hotelId = req.currentUser.activeHotel
    const { categoryId } = req.params
    const response = await getSingleFoodMenuCategoryService(userId, hotelId, categoryId)
    return res.status(200).json({ message: "Single food menu category loaded successfully.", data: response })
  } catch (error) {
    return next(error)
  }
}
