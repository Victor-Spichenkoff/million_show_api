export type AnswerReponse = {
    isCorrect: true,
} | {
    isCorrect: false,
    finalPrize: number
    correctAnswer: string
}