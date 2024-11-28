import Database from "../../../configs/db.config"
import { TCreateMenuItem } from "../../../schema/food-menu/item/create.schema"
import KnownError from "../../../utils/knownError.utils";

export async function createMenuItemService(data: TCreateMenuItem, hotelId: string, userId: string, image: string[] | undefined) {
  if (data.category) {

    const existingCategory = await Database.client.foodMenuCategory.count({ where: { id: data.category } });
    if (existingCategory != 1) {
      throw new KnownError('The selected category is was not found. Please provide a valid category.', 404)
    }
  }

  const menuItem = Database.client.foodMenuItem.create({
    data: {
      name: data.name,
      price: data.price,
      description: data.description,
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
      },
      category: data.category ? { connect: { id: data.category } } : undefined
    }
  })

  return menuItem
}
