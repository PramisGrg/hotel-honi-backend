import Database from "../../configs/db.config"
import { TCreateWebsiteSchema } from "../../schema/website/create.schema"
import KnownError from "../../utils/knownError.utils"

export async function createWebsiteService(data: TCreateWebsiteSchema, hotelId: string, _userId: string) {
  const createdWebsite = await Database.client.websiteMetadata.create({
    data: {
      url: data.url,
      title: data.title,
      description: data.description || undefined,
      customDomain: data.customDomain,
      hotelId
    }
  })

  // await fetch(process.env.VERCEL_API_ENDPOINT, {
  //   headers: {
  //     'content-type': 'application/json',
  //     'Authorization': `Bearer ${process.env.VERCEL_API_KEY}`,
  //   }
  // })

  if (!createdWebsite) {
    throw new KnownError("Failed to create website.")
  }

  //todo: Implement activity for this created room

  return createdWebsite
}
