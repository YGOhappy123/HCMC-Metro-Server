import { Request, Response, NextFunction } from 'express'
import { ISearchParams } from '@/interfaces/params'
import lineServices from '@/services/lineServices'

const lineController = {
    getLines: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { skip, limit, sort, filter } = req.query
            const { lines, total } = await lineServices.getLines({
                skip: skip !== undefined ? parseInt(skip as string) : undefined,
                limit: limit !== undefined ? parseInt(limit as string) : undefined,
            } as ISearchParams)

            res.status(200).json({ data: lines, total, took: lines.length })
        } catch (error) {
            next(error)
        }
    },
    searchLines: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { skip, limit, sort, filter } = req.query
            const { lines, total } = await lineServices.getLines({
                skip: skip !== undefined ? parseInt(skip as string) : undefined,
                limit: limit !== undefined ? parseInt(limit as string) : undefined,
                sort,
                filter
            } as ISearchParams)

            res.status(200).json({ data: lines, total, took: lines.length })
        } catch (error) {
            next(error)
        }
    }
}

export default lineController
