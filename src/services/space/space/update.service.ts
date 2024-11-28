import Database from "../../../configs/db.config"
import { TUpdateSpaceSchema } from "../../../schema/space/space/update.schema"
import KnownError from "../../../utils/knownError.utils"

export async function updateSpaceService(data: TUpdateSpaceSchema, spaceId: string, _userId: string, hotelId: string) {
  const updatedSpace = await Database.client.space.update({
    where: { id: spaceId, hotelId },
    data: {
      name: data.name
    }
  })

  // ! todo: add this activity to history.

  if (!updatedSpace) {
    throw new KnownError("No space with provided information was found to update.")
  }
  return updatedSpace
}
