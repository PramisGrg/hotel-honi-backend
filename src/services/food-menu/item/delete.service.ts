import { disconnect } from "process";
import Database from "../../../configs/db.config"
import KnownError from "../../../utils/knownError.utils";

export async function deleteMenuItemService(foodMenuId: string, userId: string) {
  const disconnectedItem = await Database.client.foodMenuItem.update({ where: { id: foodMenuId }, data: { category: { disconnect: true } } });
  if (!disconnectedItem) {
    throw new KnownError('Item to delete was not found, please try again later.', 404)
  }
  const deleteMenuItem = await Database.client.foodMenuItem.delete({
    where: { id: foodMenuId }
  })
  return deleteMenuItem
}
