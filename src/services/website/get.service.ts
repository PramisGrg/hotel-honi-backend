import Database from "../../configs/db.config"
import { TCreateWebsiteSchema } from "../../schema/website/create.schema"
import KnownError from "../../utils/knownError.utils"

export async function getWebsiteService(hotelId: string, _userId: string) {
  const createdWebsite = await Database.client.websiteMetadata.findFirst({
    where: {
      hotelId
    }
  })

  if (!createdWebsite) {
    throw new KnownError("Failed to get website.")
  }

  //todo: Implement activity for this created room

  return createdWebsite
}
