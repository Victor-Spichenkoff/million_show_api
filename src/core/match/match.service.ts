import { BadRequestException, Injectable } from '@nestjs/common'
import { CreateMatchDto } from './dto/create-match.dto'
import { UpdateMatchDto } from './dto/update-match.dto'
import { Match } from 'models/match.model'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Historic } from 'models/historic.model'
import { UserService } from '../user/user.service'
import { isAlreadyStarted } from 'helpers/matchHepers'
import { formatToCompleteNormalTime } from 'helpers/time'

@Injectable()
export class MatchService {
    constructor(
        @InjectRepository(Match) private readonly _matchRepo: Repository<Match>,
        @InjectRepository(Historic) private readonly _historyRepo: Repository<Historic>,
        private readonly _userService: UserService
    ) { }

    async create(createMatchDto: CreateMatchDto, userId: number, force = false) {
        const user = await this._userService.findOne(userId, true)
        if (!user) throw new BadRequestException("User doesn't exist")

        // já iniciada
        const alreadyStartedMatch = isAlreadyStarted(user.matchs)
        if (alreadyStartedMatch && !force) {
            const time = formatToCompleteNormalTime((new Date(alreadyStartedMatch[0].startDate)))
            throw new BadRequestException("You have already started a match at " + time + ". Please use /match/start?force=true")
        } else if (alreadyStartedMatch && force) 
                this.setManyToCancelled(alreadyStartedMatch)


        const newMatch = new Match()
        newMatch.user = user

        const createdMatch = await this._matchRepo.save(newMatch)

        const newHistoric = new Historic()
        newHistoric.user = user
        newHistoric.match = createdMatch

        await this._historyRepo.save(newHistoric)

        const finalMatch = await this._matchRepo.findOne({
            where: { id: createdMatch.id },
            relations: { historic: true },
            // relations: ["historic"],
        })


        return finalMatch
    }


    findAll() {
        return this._matchRepo.find({
            relations: {
                historic: true,
                user: true
            }
        })
    }


    findOne(id: number) {
        return `This action returns a #${id} match`
    }


    update(id: number, updateMatchDto: UpdateMatchDto) {
        return `This action updates a #${id} match`
    }

    
    
    async remove(id: number) {
        return this._matchRepo.delete(id)
    }

    async removeByUser(userId: number) {
        await this._matchRepo.delete({
            user: { id: userId }
        })
    }

    async setManyToCancelled (matchs: Match[]) {
        for(let match of matchs) {
            match.state = "cancelled"
            await this._matchRepo.update(match.id, match)
        }
    }
}
