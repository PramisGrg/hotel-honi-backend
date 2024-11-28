import Database from "../../../configs/db.config"
import KnownError from "../../../utils/knownError.utils"

export async function getSingleTableService(tableId: string, hotelId: string) {
  const existingTable = await Database.client.table.findFirst({ where: { id: tableId, hotelId } })

  if (!existingTable) {
    throw new KnownError("No table was found with such details.", 404)
  }

  return existingTable
}

export async function getAllTableService(hotelId: string, take: number, skip: number, search: string) {
  const existingTables = await Database.client.table.findMany({
    where: { hotelId, name: { contains: search } },
    select: {
      id: true,
      name: true,
      capacity: true,
      status: true,
      space: {
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
  return existingTables
}
