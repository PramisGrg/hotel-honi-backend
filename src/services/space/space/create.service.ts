import Database from "../../../configs/db.config"
import { TCreateSpaceSchema } from "../../../schema/space/space/create.schema"
import KnownError from "../../../utils/knownError.utils"

export async function createSpaceService(data: TCreateSpaceSchema, _userId: string, hotelId: string) {
  const createdSpace = await Database.client.space.create({
    data: {
      name: data.name,
      hotelId
    }
  })

  if (!createdSpace) {
    throw new KnownError("Failed to create space.")
  }

  //todo: add activity to indicate that the user has created space

  return createdSpace
}
