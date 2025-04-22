import { ISearchParams } from '@/interfaces/params'
import Line from '@/models/Line'
import { Op } from 'sequelize'

const lineServices = {
    getLines: async ({ skip = 0, limit = 8, filter = '{}', sort = '[]' }: ISearchParams) => {
        const { count, rows: lines } = await Line.findAndCountAll({
            limit: limit,
            offset: skip,
            where: buildWhereStatement(filter)
        });

        return {
            lines: lines.map(line => line.toJSON()),
            total: count
        }
    }
}

export default lineServices



export const buildWhereStatement = (filter: string = '{}') => {
    const parsedFilter = JSON.parse(filter)
    const whereStatement: any = {}

    for (const criteria in parsedFilter) {
        if (parsedFilter[criteria] != undefined) {
            switch (criteria) {
                case 'stationId':
                    whereStatement.stationId = { [Op.eq]: parsedFilter[criteria]}
                case 'lineName':
                    whereStatement.lineName = { [Op.like]: `%${parsedFilter[criteria]}%` }
                    break
                case 'distance':
                    whereStatement.distance = { [Op.like]: `%${parsedFilter[criteria]}%` }
                    break
                default:
                    whereStatement[criteria] = parsedFilter[criteria]
                    break
            }
        }
    }

    return whereStatement
}