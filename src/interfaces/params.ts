export interface ISearchParams {
    skip?: number
    limit?: number
    filter?: string
    sort?: string
}

export type StatisticType = 'daily' | 'weekly' | 'monthly' | 'yearly'
