export type AnswerResponse = {
    isCorrect: true,
    points?: number
} | {
    isCorrect: false,
    finalPrize: number
    correctAnswer: number,
    points: number
}
