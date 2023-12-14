import { pick } from 'lodash'
import { Request, Response, NextFunction } from 'express'

type FilterKeys<T> = Array<keyof T>

export const filterMiddleware =
  <T>(filterKeys: FilterKeys<T>) =>
  (req: Request, res: Response, next: NextFunction) => {
    pick(req.body, filterKeys)

    next()
  }
