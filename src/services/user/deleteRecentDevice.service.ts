import Database from "../../configs/db.config";
import KnownError from "../../utils/knownError.utils";

export async function deleteRecentDeviceLoginService(deviceId: string, userId: string) {
  const deletedRecentDevice = await Database.client.recentLogins.update({
    where: {
      id: deviceId,
      userId: userId
    },
    data: {
      isBlacklisted: true,
    }
  })

  if (!deletedRecentDevice) {
    throw new KnownError("Failed to remove the device");
  }

  return deletedRecentDevice;
}