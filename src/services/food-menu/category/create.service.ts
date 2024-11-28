import Database from "../../../configs/db.config"
import { TCreateFoodCategory } from "../../../schema/food-menu/category/create.schema"
import KnownError from "../../../utils/knownError.utils"

export async function createFoodCategoryService(data: TCreateFoodCategory, userId: string, hotelId: string, image: string[] | undefined) {
  const foodCategory = Database.client.foodMenuCategory.create({
    data: {
      name: data.name,
      image: image ? image[0] : undefined,
      hotel: {
        connect: {
          id: hotelId
        }
      },
      createdBy: {
        connect: {
          id: userId
        }
      }
    }
  })
  if (!foodCategory) {
    throw new KnownError("Failed to create food category")
  }
  return foodCategory
}
