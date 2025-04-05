import { AnswerIndex } from "types/indexs"
import { getRandomIntInclusive } from "./numeric"


const lastIndex = 4

export const getUniversitaryAnswer = (answerIndex: AnswerIndex, successProb): UnivertiraryAnswer => {
    let finalIndex = answerIndex
    let mainProb = getRandomIntInclusive(79, 99)
    let hasDoubt = false//ser tipo 30/40 em duas
    if (successProb < 3) {// realmente para trolar
        finalIndex = getIncorrectAnwer(answerIndex)
    } else if (successProb < 13) {// meio indeciso
        mainProb = getRandomIntInclusive(30, 60)
        hasDoubt = true
    }

    const remanings = getRemaningsProbs(mainProb,)
    const res = new UnivertiraryAnswer()

    // formatar e colocar as porcentages
    // deve ser um for usando as key

    return res
}


const getIncorrectAnwer = (correctIndex: AnswerIndex): AnswerIndex => {
    while (true) {
        const incorrectAnswer = getRandomIntInclusive(1, lastIndex)
        if (incorrectAnswer != correctIndex)
            return incorrectAnswer as AnswerIndex// erro aqui
    }
}


const getRemaningsProbs = (baseProb: number, hasDoubt = false): number[] => {
    while (true) {
        let total = baseProb
        let doubtPercent = 0
        if (hasDoubt) {
            doubtPercent = getRandomIntInclusive(25, 100 - total)
        } else {// é normal
            console.log("total: " + total)
            doubtPercent = getRandomIntInclusive(0, 100 - total)
        }

        const remaningPercents1 = getRandomIntInclusive(0, 100 - total) ?? 0
        total += remaningPercents1

        const lastPercent = getRandomIntInclusive(0, 100 - total) ?? 0


        const resNotOrdened = [doubtPercent, remaningPercents1, lastPercent]

        if (total == 100) {
            return unSortRemaning(resNotOrdened)
        }
    }


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

// getUniversitaryAnswer(1, 60)
// TODO -> tá vindo bugado, sempre 10 e não respeta o 100
const baseProb = 90
console.log([... getRemaningsProbs(baseProb, false), baseProb])