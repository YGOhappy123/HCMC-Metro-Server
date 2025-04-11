import randomstring from 'randomstring'

export const capitalizeWords = (input: string) => {
    const MULTI_SPACE_REGEX = /\s+/g

    if (!input.trim()) return ''
    return input
        .trim()
        .replace(MULTI_SPACE_REGEX, ' ')
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.substring(1).toLowerCase())
        .join(' ')
}

export const generateRandomString = (length?: number) => {
    const RANDOM_STRING_LENGTH = 16

    return randomstring.generate(length ?? RANDOM_STRING_LENGTH)
}
