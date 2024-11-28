import type { Response, NextFunction } from "express"
import { SecureRequest } from "../../../interfaces/general/request.interface"
import { TUpdateFoodMenuCategory } from "../../../schema/food-menu/category/update.schema"
import KnownError from "../../../utils/knownError.utils"
import { updateFoodMenuCategoryService } from "../../../services/food-menu/category/update.service"

interface IUpdateFoodMenuCategoryRequest extends SecureRequest {
  body: TUpdateFoodMenuCategory
}

export async function updateFoodMenuCategoryController(
  req: IUpdateFoodMenuCategoryRequest,
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
    const { categoryId } = req.params
    const response = await updateFoodMenuCategoryService(req.body, categoryId, req.imageUrl)
    return res.status(200).json({ message: "Food menu category updated successfully.", data: response })
  } catch (error) {
    return next(error)
  }
}
