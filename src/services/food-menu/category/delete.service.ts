import Database from "../../../configs/db.config"
import KnownError from "../../../utils/knownError.utils"

export async function deleteFoodMenuCategoryService(categoryId: string, hotelId: string) {
  const deletedFoodMenuCategory = await Database.client.foodMenuCategory.delete({
    where: {
      id: categoryId,
      hotelId
    }
  })
  if (!deletedFoodMenuCategory) {
    throw new KnownError("Failed to delete food category.")
  }
  return deletedFoodMenuCategory
}
