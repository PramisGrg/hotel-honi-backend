import Database from "../../../configs/db.config"
import { TUpdateMenuItem } from "../../../schema/food-menu/item/update.schema"

export async function updateMenuItemService(data: TUpdateMenuItem, id: string, image: string[] | undefined) {
  const updateMenuItem = await Database.client.foodMenuItem.update({
    where: { id },
    data: {
      name: data.name,
      price: data.price,
      description: data.description,
      foodMenuCategoryId: data.category,
      image: image ? image[0] : undefined
    }
  })
  return updateMenuItem
}
