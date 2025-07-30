import {Historic} from "../models/historic.model";

export type HomeInfos = {
    points: number | string
    leaderBoardPosition?: null | number
    correctAnswers: number | string
    accumulatedPrizes?: null | number
    matchId: null | number
    recentHistoric: Historic[] | null
}
