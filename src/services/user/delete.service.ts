import Database from "../../configs/db.config";
import KnownError from "../../utils/knownError.utils";

export async function deleteUserService(userId: string) {
    const existingUser = await Database.client.user.findFirst({ where: { id: userId } });
    if (!existingUser) {
        throw new KnownError('No such user found to delete')
    }
    const deletedUser = await Database.client.user.delete({ where: { id: userId } });
    return deletedUser;
}