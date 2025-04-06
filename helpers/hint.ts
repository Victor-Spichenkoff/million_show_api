import { AnswerIndex } from "types/indexs"
import { getRandomIntInclusive } from "./numeric"


const lastIndex = 4

export const getUniversitaryAnswer = (answerIndex: AnswerIndex, successProb): UnivertiraryAnswer => {
    let finalIndex = answerIndex
    const res = new UnivertiraryAnswer()
    let mainPercent = getRandomIntInclusive(79, 99)
    
    let hasDoubt = false//ser tipo 30/40 em duas
    if (successProb < 3) {// realmente para trolar
        finalIndex = getIncorrectAnwer(answerIndex)
    } else if (successProb < 13) {// meio indeciso
        finalIndex = getIncorrectAnwer(answerIndex)
        mainPercent = getRandomIntInclusive(30, 60)
        hasDoubt = true 
    }// já é sucesso
    
    const remanings = getRemaningsProbs(mainPercent, hasDoubt)
    res[`option${finalIndex}`] = mainPercent 


    let i = 0
    for (let key of Object.keys(res)) {
        if (res[key] == 0){ // não é o main
            res[key] = remanings[i]
            i += 1
        }
    }

    return res
}


const getIncorrectAnwer = (correctIndex: AnswerIndex): AnswerIndex => {
    while (true) {
        const incorrectAnswer = getRandomIntInclusive(1, lastIndex)
        if (incorrectAnswer != correctIndex)
            return incorrectAnswer as AnswerIndex// erro aqui
    }
}


const getRemaningsProbs = (basePercent: number, hasDoubt = false): number[] => {
    for (let i = 0; i < 10; i++) {
        let total = basePercent
        let doubtPercent = 0
        if (hasDoubt) {
            doubtPercent = getRandomIntInclusive(25, 100 - total)
            total += doubtPercent
        } else {// é normal
            doubtPercent = getRandomIntInclusive(0, 95 - total) ?? 0
            // doubtPercent = getRandomIntInclusive(0, 100 - total) ?? 0
            total += doubtPercent
        }

        const remaningPercents1 = getRandomIntInclusive(0, 97 - total) ?? 0
        total += remaningPercents1

        const lastPercent = getRandomIntInclusive(0, 100 - total) ?? 0

        const resNotOrdened = [doubtPercent, remaningPercents1, lastPercent]


        if (total == 100 && !hasNegative(resNotOrdened)) {
            return resNotOrdened
            // return unSortRemaning(resNotOrdened)
        }
    }
    // emergencia
    let n1 = getRandomIntInclusive(0, 100 - basePercent)
    let n2 = getRandomIntInclusive(0, 100 - n1 - basePercent)
    let n3 = 100 - n2 - n1 - basePercent

    return unSortRemaning([n1, n2, n3])
}

const hasNegative = (nums: number[]) => {
    const result = nums.map((n) => n < 0)
    return result.includes(true)
}

const unSortRemaning = (sortedRes: number[]) => {
    const res: number[] = []
    const alreadyUsed: number[] = []
    Array.from("012").forEach(i => {
        while (true) {
            const index = getRandomIntInclusive(0, lastIndex - 2)
            if (!alreadyUsed.includes(index)) {
                res.push(sortedRes[index])
                alreadyUsed.push(index)
                break
            }
        }
    })

    return res
}


class UnivertiraryAnswer {
    option1: number = 0
    option2: number = 0
    option3: number = 0
    option4: number = 0
}