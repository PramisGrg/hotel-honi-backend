import Database from "../../configs/db.config"
import KnownError from "../../utils/knownError.utils"

export async function deleteWebsiteService(websiteId: string, _userId: string) {
  const deletedWebsite = await Database.client.websiteMetadata.delete({
    where: { id: websiteId }
  })

  if (!deletedWebsite) {
    throw new KnownError("Failed to delete website.")
  }

  //todo: Implement activity for this created room

  return deletedWebsite
}
