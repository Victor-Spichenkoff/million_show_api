import { BadRequestException } from "@nestjs/common";
import { Match } from "models/match.model";
import { MatchValidator } from "types/matchValidator";
import { Prizes } from "types/prizes";

export const isAlreadyStarted = (matchs: Match[]): false | Match[] => {
    if (!matchs || matchs.length == 0)
        return false

    const alreadystarted = matchs.filter((m) => m.state == "playing")

    return alreadystarted.length > 0 && alreadystarted
}

export const giveCurrentMatch = (matchs: Match[] | undefined) => {
    if (!matchs)
        return null

    const currentMatch = matchs.filter(m => m.state == "playing")

    if (currentMatch.length == 0)
        return null


    return currentMatch[0]
}

export const giveCurrentMatchOrThrow = (matchs: Match[] | undefined) => {
    if (!matchs)
        throw new BadRequestException("User has no active match")

    const currentMatch = matchs.filter(m => m.state == "playing")

    if (currentMatch.length == 0)
        throw new BadRequestException("User has no active match")


    return currentMatch[0]
}


export const prizes = [0, 0, 1_000, 2_000, 3_000, 4_000, 5_000,
    10_000, 20_000, 30_000, 40_000, 50_000,
    100_000, 200_000, 300_000, 400_000, 500_000 ]


/** */
export const getCurrentPrizes = (index: number): Prizes => {
    if (index == 1)
        return {
            wrongPrize: 0,
            stopPrize: 0,
            nextPrize: 1_000
        }

    if (index == 16)
        return {
            wrongPrize: 0,
            stopPrize: 500_000,
            nextPrize: 1_000_000
        }

    return {
        wrongPrize: prizes[index - 1],
        stopPrize: prizes[index],
        nextPrize: prizes[index + 1]
    }
}

export const getLevelByQuetionIndex = (questionIndex: number) => {
    if(questionIndex < 5)
        return 1
    else if (questionIndex < 10)
        return 2

    return 3
}


/**
 *
 * * configura se deve jogar erro
 * @param param1
 * * is... -> deve ser igual àquilo, ou erro
 */
export const validateMatch =(match: Match,
    {hasSkip, isWaiting}: MatchValidator) => {
    if (hasSkip && match.skips == 0)
        throw new BadRequestException("You don't have more skips!")
    if(isWaiting && match.questionState != "waiting")
        throw new BadRequestException("Question already answered")
}
