export type AnswerReponse = {
    isCorrect: true,
    points?: number
} | {
    isCorrect: false,
    finalPrize: number
    correctAnswer: string,
    points: number
}
