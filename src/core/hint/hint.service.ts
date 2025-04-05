import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm';
import { Question } from 'models/question.model';
import { Repository } from 'typeorm';
import { Match } from 'models/match.model';
import { User } from 'models/user.model';
import { giveCurrentMatchOrThrow, validateMatch } from 'helpers/matchHepers';

@Injectable()
export class HintService {
  constructor(
    @InjectRepository(Question) private readonly _questionRepo: Repository<Question>,
    @InjectRepository(Match) private readonly _matchRepo: Repository<Match>,
    @InjectRepository(User) private readonly _userRepo: Repository<User>
  ) {}

  async skip(userId: number) {
    const user = await this._userRepo.findOne({
      where: { id: userId },
      relations: { matchs: true }
    })

    const match = giveCurrentMatchOrThrow(user?.matchs)//await this._matchRepo.findOneBy({ id: matchId })

    validateMatch(match, {
      hasSkip: true, isWaiting: true
    })

    if(match.questionIndex >= 15)
      throw new BadRequestException("You can't skip the Million Quest")

    

    match.skips -= 1
    match.hintState = "none"
    match.questionState = "answered"

    await this._matchRepo.update(match.id, match)
    return "Skiped"
}
}
