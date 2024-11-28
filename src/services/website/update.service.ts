import Database from "../../configs/db.config"
import { TUpdateWebsiteSchema } from "../../schema/website/update.schema"
import KnownError from "../../utils/knownError.utils"

export async function updateWebsiteService(data: TUpdateWebsiteSchema, websiteId: string, _userId: string) {
  const updatedWebsite = await Database.client.websiteMetadata.update({
    where: {
      id: websiteId
    },
    data: {
      url: data.url,
      title: data.title,
      description: data.description,
      customDomain: data.customDomain
    }
  })

  if (!updatedWebsite) {
    throw new KnownError("Failed to update website.")
  }

  //todo: Implement activity for this created room

  return updatedWebsite
}
