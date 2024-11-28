import Database from "../../../configs/db.config"
import { TUpdateFoodMenuCategory } from "../../../schema/food-menu/category/update.schema"
import KnownError from "../../../utils/knownError.utils"

export async function updateFoodMenuCategoryService(data: TUpdateFoodMenuCategory, id: string, image: string[] | undefined) {
  const updateFoodMenuCategory = Database.client.foodMenuCategory.update({
    where: { id },
    data: {
      name: data.name,
      image: image ? image[0] : undefined
    }
  })
  if (!updateFoodMenuCategory) {
    throw new KnownError("Failed to update food category.")
  }
  return updateFoodMenuCategory
}
