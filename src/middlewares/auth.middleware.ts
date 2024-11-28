import type { Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import KnownError from '../utils/knownError.utils'

import dotenv from 'dotenv'
import { SecureRequest, SecureRequestUserData } from '../interfaces/general/request.interface'
dotenv.config()

export async function authMiddleware(req: SecureRequest, _res: Response, next: NextFunction) {
  try {
    const token = req.header('Authorization')
    if (!token) {
      throw new KnownError(`You're not logged in, please login and try again.`)
    }
    const [tokenType, tokenValue] = token.split(' ')

    if (tokenType != 'Bearer') {
      throw new KnownError('Sorry, the login method used is not valid here.')
    }

    let userData

    try {
      userData = jwt.verify(tokenValue, process.env.JWT_SECRET ?? "") as SecureRequestUserData
    } catch (error) {
      throw new KnownError('Sorry, you are not allowed to perform this action.', 403)
    }

    req.currentUser = userData

    return next()
  } catch (error) {
    return next(error)
  }
}
