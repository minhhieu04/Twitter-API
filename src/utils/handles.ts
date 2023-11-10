import { Request, Response, NextFunction, RequestHandler } from 'express'

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  return res.status(400).json({ error: err.message })
}

export const wrapRequestHandler = (func: RequestHandler) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await func(req, res, next)
    } catch (error) {
      next(error)
    }
  }
}
