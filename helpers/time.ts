export const formatToCompleteNormalTime = (date: Date) => {
    return `${zeroFill(date.getHours())}:${zeroFill(date.getMinutes())} ${zeroFill(date.getDate())}/${zeroFill(date.getMonth())}/${date.getFullYear()}`
}

export const zeroFill = (num: number, size = 2) =>  ('0' + num).slice(-size)


/*
* 10 min to 5 days
* */
export const seedRandomDate = (isMoreThanNow?: boolean) => {
    const now = Date.now()
    const tenMinutes = 10 * 60 * 1000
    const twoHours =  2 * 60 * 60 * 1000


    const randomOffset = Math.floor(Math.random() * (twoHours - tenMinutes) + tenMinutes)

    return isMoreThanNow ? now + randomOffset : now - randomOffset
}


