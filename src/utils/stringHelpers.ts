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
