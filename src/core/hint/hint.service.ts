import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm';
import { Question } from 'models/question.model';
import { Repository } from 'typeorm';
import { Match } from 'models/match.model';
import { User } from 'models/user.model';
import { validateMatch } from 'helpers/matchHepers';
import { HistoricService } from '../historic/historic.service';
import { getRandomIntInclusive } from 'helpers/numeric';
import { getHalfQuestion, getUniversitaryAnswer } from 'helpers/hint';

@Injectable()
export class HintService {
    constructor(
        @InjectRepository(Match) private readonly _matchRepo: Repository<Match>,
        private readonly historicService: HistoricService
    ) { }

    async skip(userId: number) {
        const match = await this.getCurrentMatch(userId)

        validateMatch(match, {
            hasSkip: true, isWaiting: true
        })

        if (match.questionIndex >= 15)
            throw new BadRequestException("You can't skip the Million Question")


        match.skips -= 1//TODO: UNCOMMENT
        match.hintState = "none"
        match.questionState = "answered"

        await this._matchRepo.update(match.id, match)//TODO: UNCOMMENT
        return "Skipped"
    }


    async universitary(userId: number) {
        const successProbability = getRandomIntInclusive(1, 100)
        const match = await this.getCurrentMatch(userId)

        if (match.questionIndex >= 15)
            throw new BadRequestException("You can't use it in the Million Question")
        if (match.hintState != "none" && match.hintState != "univertitary")
            throw new BadRequestException("Question already hinted")

        const question = await this.historicService.getCurrentQuestionByUserId(userId)

        const universiraryRes = getUniversitaryAnswer(question.answerIndex, successProbability)

        if (match.hintState == "none") {
            if (match.universitary == 0)
                throw new BadRequestException("You don't have more of this help")
            match.universitary -= 1//TODO: UNCOMMENT
            match.hintState = "univertitary"
        } else {
            match.hintState = "none"
        }

        await this._matchRepo.update(match.id, match)

        return {...universiraryRes, id: question.id }
    }


    async halfHalf(userId: number) {
        const match = await this.getCurrentMatch(userId)

        if (match.questionIndex >= 15)
            throw new BadRequestException("You can't use it in the Million Question")
        if (match.hintState != "none" && match.hintState != "half")
            throw new BadRequestException("Question already hinted")

        const question = await this.historicService.getCurrentQuestionByUserId(userId)

        if (match.hintState == "none") {
            if (match.halfHalf == 0)
                throw new BadRequestException("You don't have more of this help")
            match.halfHalf -= 1//TODO
            match.hintState = "half"
        } else {
            match.hintState = "none"
        }

        await this._matchRepo.update(match.id, match)
        return getHalfQuestion(question)

    }


    private async getCurrentMatch(userId) {
        const matchs = await this._matchRepo.find({
            where: { user: { id: userId }, state: "playing" }
        })

        if (!matchs.length)
            throw new BadRequestException("user has no active match")
        if (matchs.length > 1)
            throw new BadRequestException("user has more than 1 active match. Please stop the others matchs")

        return matchs[0]
    }
}
