import jwt from 'jsonwebtoken'
import { SecureRequestUserData } from '../interfaces/general/request.interface'

export function generateToken(payload: SecureRequestUserData, duration?: string) {
  try {
    const token = jwt.sign(payload, process.env.JWT_SECRET ?? '', {
      expiresIn: duration
    })
    return token
  } catch (error) {
    return false
  }
}
