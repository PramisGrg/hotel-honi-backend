import type { Response, NextFunction } from "express"
import { SecureRequest } from "../../../interfaces/general/request.interface"
import { TCreateFoodCategory } from "../../../schema/food-menu/category/create.schema"
import KnownError from "../../../utils/knownError.utils"
import { createFoodCategoryService } from "../../../services/food-menu/category/create.service"

interface ICreateFoodMenuCategoryController extends SecureRequest {
  body: TCreateFoodCategory
}

export async function createFoodCategoryController(
  req: ICreateFoodMenuCategoryController,
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
    const data = req.body
    const response = await createFoodCategoryService(data, req.currentUser.id, req.currentUser.activeHotel, req.imageUrl)
    return res.status(200).json({ message: "Food menu category created successfully.", data: response })
  } catch (error) {
    return next(error)
  }
}
