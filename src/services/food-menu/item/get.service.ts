import Database from "../../../configs/db.config"

export async function getSingleMenuItemService(itemId: string, hotelId: string) {
  const menuItem = Database.client.foodMenuItem.findFirst({
    where: { id: itemId, hotelId },
    select: {
      id: true,
      name: true,
      description: true,
      image: true,
      price: true,
      createdBy: true,
      createdAt: true,
      updatedAt: true,
      category: {
        select: {
          id: true,
          name: true
        }
      }
    }
  })
  return menuItem
}

export async function getMenuItemService(hotelId: string, take: number, skip: number, search: string) {
  const menuItem = Database.client.foodMenuItem.findMany({
    where: { hotelId, name: { contains: search } },
    select: {
      id: true,
      name: true,
      image: true,
      price: true,
      description: true,
      updatedAt: true,
      createdAt: true,
      category: {
        select: {
          id: true,
          name: true
        }
      }
    },
    take,
    skip,
    orderBy: { createdAt: "desc" }
  })
  return menuItem
}
