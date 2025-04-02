export const formatToCompleteNormalTime = (date: Date) => {
    return `${zeroFill(date.getHours())}:${zeroFill(date.getMinutes())} ${zeroFill(date.getDate())}/${zeroFill(date.getMonth())}/${date.getFullYear()}`
} 

export const zeroFill = (num: number, size = 2) =>  ('0' + num).slice(-size)
