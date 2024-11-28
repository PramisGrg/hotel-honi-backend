import Database from "../../configs/db.config";
import { SecureRequestUserData } from "../../interfaces/general/request.interface";
import { generateToken } from "../../utils/generateToken.utils";
import KnownError from "../../utils/knownError.utils";

export async function switchHotelService(hotelId: string, userId: string) {
    const hotelUserRel = await Database.client.hotelUserRel.findFirst({ where: { hotelId, userId }, include: { hotel: true, role: true, user: true } });
    if (!hotelUserRel) {
        throw new KnownError('Sorry, you do not belong to the provided hotel.');
    }

    const updatedUser = await Database.client.user.update({ where: { id: userId }, data: { activeHotelId: hotelId } })
    if (!updatedUser) {
        throw new KnownError('Error while switching hotel, please try again later.')
    }

    const tokenData: SecureRequestUserData = {
        id: hotelUserRel.user.id,
        name: hotelUserRel.user.name,
        dialCode: hotelUserRel.user.dialCode,
        activeHotel: hotelUserRel.hotel.id,
        permissions: hotelUserRel.role.permissions
    }

    const token = generateToken(tokenData, '30d');
    return { token }
}