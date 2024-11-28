import type { Request, Response, NextFunction } from 'express'
import type { ZodSchema } from 'zod'

// validates any given zod schema against the request body.
export function validateBody(schema: ZodSchema) {
  return async (req: Request, _res: Response, next: NextFunction) => {
    try {
      const parseResult = await schema.parse(req.body)
      req.body = parseResult
      return next()
    } catch (error) {
      return next(error)
    }
  }
}
