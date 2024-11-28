import type { Request, Response, NextFunction } from 'express'

//! Handles the routes that do not match any params in the application.
export async function notFoundHandler(error: unknown, req: Request, res: Response, next: NextFunction) {
  try {
    return res.status(404).json({ message: 'The requested content was not found.' })
  } catch (error) {
    return next(error)
  }
}
