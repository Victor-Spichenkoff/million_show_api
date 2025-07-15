import {Historic} from "../models/historic.model";

export type HomeInfos = {
    points: number | string
    leaderBoardPosition: number | string
    correctAnswers: number | string
    accumulatedPrizes: number | string
    matchId: null | number
    recentHistoric: Historic[] | null
}
