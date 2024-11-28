import Database from "../../../configs/db.config"

export async function getSingleSpaceService(spaceId: string, hotelId: string) {
  const existingSpace = await Database.client.space.findFirst({ where: { id: spaceId, hotelId } })
  return existingSpace
}

export async function getAllSpaceService(hotelId: string, take: number, skip: number, search: string) {
  const existingSpaces = await Database.client.space.findMany({
    where: { hotelId, name: { contains: search } },
    select: {
      id: true,
      name: true
    },
    take,
    skip,
    orderBy: { createdAt: "desc" }
  })
  return existingSpaces
}
