import { Op } from 'sequelize'
import { parseTime } from '@/utils/timeHelpers'

export const buildWhereStatement = (filter: string = '{}') => {
    const parsedFilter = JSON.parse(filter)
    const whereStatement: any = {}

    for (const criteria in parsedFilter) {
        if (parsedFilter[criteria] !== undefined) {
            switch (criteria) {
                case 'startTime':
                    whereStatement.createdAt = whereStatement.createdAt || {}
                    whereStatement.createdAt[Op.gte] = parseTime(parsedFilter[criteria])
                    break
                case 'endTime':
                    whereStatement.createdAt = whereStatement.createdAt || {}
                    whereStatement.createdAt[Op.lte] = parseTime(parsedFilter[criteria] + ' 23:59:59')
                    break
                case 'startIssuedTime':
                    whereStatement.issuedAt = whereStatement.issuedAt || {}
                    whereStatement.issuedAt[Op.gte] = parseTime(parsedFilter[criteria])
                    break
                case 'endIssuedTime':
                    whereStatement.issuedAt = whereStatement.issuedAt || {}
                    whereStatement.issuedAt[Op.lte] = parseTime(parsedFilter[criteria] + ' 23:59:59')
                    break
                case 'startHireTime':
                    whereStatement.hireDate = whereStatement.hireDate || {}
                    whereStatement.hireDate[Op.gte] = parseTime(parsedFilter[criteria])
                    break
                case 'endHireTime':
                    whereStatement.hireDate = whereStatement.hireDate || {}
                    whereStatement.hireDate[Op.lte] = parseTime(parsedFilter[criteria] + ' 23:59:59')
                    break
                case 'isActive':
                case 'isWorking':
                    whereStatement['$Account.isActive$'] = [true, 'true', 1].includes(parsedFilter[criteria])
                    break
                case 'fullName':
                    whereStatement.fullName = { [Op.like]: `%${parsedFilter[criteria]}%` }
                    break
                case 'email':
                    whereStatement.email = { [Op.like]: `%${parsedFilter[criteria]}%` }
                    break
                case 'phoneNumber':
                    whereStatement.phoneNumber = { [Op.like]: `%${parsedFilter[criteria]}%` }
                    break
                case 'payments':
                    if ([true, 'true', 1].includes(parsedFilter[criteria])) {
                        whereStatement.paymentTime = { [Op.ne]: null }
                    } else if ([false, 'false', 0].includes(parsedFilter[criteria])) {
                        whereStatement.paymentTime = { [Op.eq]: null }
                    }
                    break
                default:
                    whereStatement[criteria] = parsedFilter[criteria]
                    break
            }
        }
    }

    return whereStatement
}
