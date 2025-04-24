import { ISearchParams } from '@/interfaces/params'
import Line from '@/models/Line'
import LineStation from '@/models/LineStation';
import Station from '@/models/Station';
import { Attributes, FindAndCountOptions, Op } from 'sequelize'

const lineServices = {
    getLines: async ({ skip = 0, limit = 8, filter = '{}', sort = '[]' }: ISearchParams) => {
        const options:  Omit<FindAndCountOptions<Attributes<Line>>, 'group'> = {
            limit: limit,
            offset: skip,
            where: buildWhereStatementForLine(filter),
        };

        const parsedFilter = JSON.parse(filter)
        if (parsedFilter.stationId) {
            options.include = {
                model: Station,
                where: buildWhereStatementForLineStation(filter)
            }
        }

        const { count, rows: lines } = await Line.findAndCountAll(options);

        return {
            lines: lines.map(line => line.toJSON()),
            total: count
        }
    }
}

export default lineServices



export const buildWhereStatementForLine = (filter: string = '{}') => {
    const parsedFilter = JSON.parse(filter)
    const whereStatement: any = {}

    for (const criteria in parsedFilter) {
        if (parsedFilter[criteria] != undefined) {
            switch (criteria) {
                case 'lineName':
                    whereStatement.lineName = { [Op.like]: `%${parsedFilter[criteria]}%` }
                    break
                case 'distance':
                    whereStatement.distance = { [Op.like]: `%${parsedFilter[criteria]}%` }
                    break
            }
        }
    }

    return whereStatement
}

export const buildWhereStatementForLineStation = (filter: string = '{}') => {
    const parsedFilter = JSON.parse(filter)
    const whereStatement: any = {}

    for (const criteria in parsedFilter) {
        if (parsedFilter[criteria] != undefined) {
            switch (criteria) {
                case 'stationId':
                    whereStatement.stationId = { [Op.eq]: parsedFilter[criteria] }
            }
            break
        }
    }
    return whereStatement
}