import { DataURI } from 'datauri/types'
import DataURIParser from 'datauri/parser'

const parser = new DataURIParser()

export const generateDataUriFromBuffer = (fileFormat: string, buffer: DataURI.Input) => {
    return parser.format(fileFormat, buffer)
}
