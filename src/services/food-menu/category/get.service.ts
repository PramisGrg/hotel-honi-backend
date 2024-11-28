import Database from "../../../configs/db.config"
import KnownError from "../../../utils/knownError.utils"

export async function getAllFoodMenuCategoryService(hotelId: string, take: number, skip: number, search: string) {
  const foodMenuCategory = Database.client.foodMenuCategory.findMany({
    where: { hotelId, name: { contains: search } },
    select: {
      id: true,
      name: true,
      image: true,
      createdAt: true,
      updatedAt: true
    },
    take,
    skip,
    orderBy: { createdAt: "desc" }
  })

  return foodMenuCategory
}

export async function getSingleFoodMenuCategoryService(userId: string, hotelId: string, foodMenuCategoryId: string) {
  const foodMenuCategory = Database.client.foodMenuCategory.findFirst({
    where: {
      id: foodMenuCategoryId,
      hotelId,
      userId
    }
  })
  if (!foodMenuCategory) {
    throw new KnownError("No food category with provided Id was found.", 404)
  }
  return foodMenuCategory
}
