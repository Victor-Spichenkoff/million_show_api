import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm';
import { Question } from 'models/question.model';
import { Repository } from 'typeorm';
import { Match } from 'models/match.model';
import { User } from 'models/user.model';
import { giveCurrentMatchOrThrow, validateMatch } from 'helpers/matchHepers';
import { HistoricService } from '../historic/historic.service';
import { getRandomIntInclusive } from 'helpers/numeric';

@Injectable()
export class HintService {
    constructor(
        @InjectRepository(Question) private readonly _questionRepo: Repository<Question>,
        @InjectRepository(Match) private readonly _matchRepo: Repository<Match>,
        @InjectRepository(User) private readonly _userRepo: Repository<User>,
        private readonly historicService: HistoricService
    ) { }

    async skip(userId: number) {
        // const user = await this._userRepo.findOne({
        //   where: { id: userId },
        //   relations: { matchs: true }
        // })

        // const match = giveCurrentMatchOrThrow(user?.matchs)//await this._matchRepo.findOneBy({ id: matchId })

        const match = await this.getCurrentMatch(userId)

        validateMatch(match, {
            hasSkip: true, isWaiting: true
        })

        if (match.questionIndex >= 15)
            throw new BadRequestException("You can't skip the Million Quest")


        match.skips -= 1
        match.hintState = "none"
        match.questionState = "answered"

        await this._matchRepo.update(match.id, match)
        return "Skiped"
    }


    async univertiraty(userId: number) {
        const isSuccessProbability = getRandomIntInclusive(1, 100)

        const question = await this.historicService.getCurrentQuestion(userId)
        const match = await this.getCurrentMatch(userId)



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
