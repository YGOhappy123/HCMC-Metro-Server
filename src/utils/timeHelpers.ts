import 'dayjs/locale/vi'
import dayjs, { Dayjs } from 'dayjs'
import tz from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'
import localizedFormat from 'dayjs/plugin/localizedFormat'

dayjs.extend(tz)
dayjs.extend(utc)
dayjs.extend(localizedFormat)
dayjs.tz.setDefault('Asia/Ho_Chi_Minh')
dayjs.locale('vi')

type TimeType = 'daily' | 'weekly' | 'monthly' | 'yearly'

export const getStartOfTimeByType = (timestamp: string | number | Date | Dayjs, type: TimeType) => {
    const date = dayjs.tz(timestamp)

    switch (type) {
        case 'daily':
            return date.startOf('day')
        case 'weekly':
            return date.startOf('week')
        case 'monthly':
            return date.startOf('month')
        case 'yearly':
            return date.startOf('year')
        default:
            throw new Error('Invalid type')
    }
}

export const getEndOfTimeByType = (timestamp: string | number | Date, type: TimeType) => {
    const date = dayjs.tz(timestamp)

    switch (type) {
        case 'daily':
            return date.endOf('day')
        case 'weekly':
            return date.endOf('week')
        case 'monthly':
            return date.endOf('month')
        case 'yearly':
            return date.endOf('year')
        default:
            throw new Error('Invalid type')
    }
}

export const getPreviousTimeByType = (timestamp: string | number | Date | Dayjs, type: TimeType) => {
    const timestampDayJs = dayjs.tz(timestamp)

    switch (type) {
        case 'daily':
            return timestampDayJs.subtract(1, 'day')
        case 'weekly':
            return timestampDayJs.subtract(1, 'week')
        case 'monthly':
            return timestampDayJs.subtract(1, 'month')
        case 'yearly':
            return timestampDayJs.subtract(1, 'year')
        default:
            throw new Error('Invalid type')
    }
}

export const getNow = () => {
    return dayjs.tz(Date.now())
}

export const isSame = (time: string | number | Date | Dayjs, compareTarget: string | number | Date | Dayjs, compareUnit: dayjs.OpUnitType) => {
    return dayjs.tz(time).isSame(dayjs.tz(compareTarget), compareUnit)
}

export const parseTime = (timeString: string) => {
    return dayjs.tz(timeString).toDate()
}
