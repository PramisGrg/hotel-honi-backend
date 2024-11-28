import dotenv from "dotenv"
import { z } from "zod"

dotenv.config()

export const envSchema = z.object({
  PORT: z.coerce.number(),
  DATABASE_URL: z.string(),
  NP_SMS_SERVER_ENDPOINT: z.string(),
  NP_SMS_SERVER_TOKEN: z.string(),
  JWT_SECRET: z.string(),
  CLOUDINARY_CLOUD_NAME: z.string(),
  CLOUDINARY_API_KEY: z.string(),
  CLOUDINARY_API_SECRET: z.string(),
  VERCEL_API_KEY: z.string(),
  VERCEL_API_ENDPOINT: z.string(),
  CLOUDFLARE_API_KEY: z.string(),
  CLOUDFLARE_API_ENDPOINT: z.string(),
})

const env = envSchema.parse(process.env)

declare global {
  namespace NodeJS {
    interface ProcessEnv extends z.infer<typeof envSchema> { }
  }
}

export default env
