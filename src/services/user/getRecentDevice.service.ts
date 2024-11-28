import Database from "../../configs/db.config"

export async function getAllRecentDeviceService(userId: string) {
  const recentDevices = await Database.client.recentLogins.findMany({
    where: {
      userId
    },
    orderBy: {
      createdAt: "desc"
    }
  })
  return recentDevices
}