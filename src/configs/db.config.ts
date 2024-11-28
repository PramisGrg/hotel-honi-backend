import { PrismaClient } from "@prisma/client"

export default class Database {
  public static client: PrismaClient

  public static async connect() {
    try {
      console.log(`Connecting to database!`)
      const client = new PrismaClient()
      await client.$executeRaw`SELECT 1+1`
      this.client = client
      console.log(`Database connected successfully.`)
    } catch (err: unknown) {
      console.error(`Error connecting database..`)
      return process.exit(1)
    }
  }
}
