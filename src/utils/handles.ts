import { Request, Response, NextFunction, RequestHandler } from 'express'

export const wrapRequestHandler = <P>(func: RequestHandler<P, any, any, any>) => {
  return async (req: Request<P>, res: Response, next: NextFunction) => {
    try {
      await func(req, res, next)
    } catch (error) {
      next(error)
    }
  }
}

export const numberEnumToArray = (numberEnum: { [key: string]: string | number }): number[] => {
  return Object.values(numberEnum).filter((value) => typeof value === 'number') as number[]
}
