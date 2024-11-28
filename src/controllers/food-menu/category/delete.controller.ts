import type { Response, NextFunction } from "express"
import { SecureRequest } from "../../../interfaces/general/request.interface"
import { deleteFoodMenuCategoryService } from "../../../services/food-menu/category/delete.service"
import KnownError from "../../../utils/knownError.utils"

export async function deleteFoodMenuCategoryController(req: SecureRequest, res: Response, next: NextFunction) {
  try {
    if (!req.currentUser || !req.currentUser.id) {
      throw new KnownError("You must be logged in to perform this action", 403)
    }
    if (!req.currentUser.activeHotel) {
      throw new KnownError("Please switch to a hotel to perform this action")
    }
    const { categoryId } = req.params
    const response = await deleteFoodMenuCategoryService(categoryId, req.currentUser.activeHotel)
    return res.status(200).json({ message: "Food menu category deleted successfully.", data: response })
  } catch (error) {
    return next(error)
  }
}
