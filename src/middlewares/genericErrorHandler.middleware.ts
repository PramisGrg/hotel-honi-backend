import type { Request, Response, NextFunction } from 'express'
import { ZodError } from 'zod'
import KnownError from '../utils/knownError.utils'

/**
 * ! This is the function responsible for handling any unhandled errors in the app.
 */
export async function genericErrorHandler(error: unknown, request: Request, res: Response, next: NextFunction) {
  try {
    console.log(error);
    if (error instanceof ZodError) {
      return res.status(400).json({
        message: 'Please satisfy the given conditions.',
        error: error.issues
      })
    }
    if (error instanceof KnownError) {
      return res.status(error.status).json({ message: error.message })
    }
    throw error;
  } catch (error) {
    return res.status(500).json({ message: 'Something went wrong!' })
  }
}
