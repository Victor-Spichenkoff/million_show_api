import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateMatchDto } from './dto/create-match.dto';
import { UpdateMatchDto } from './dto/update-match.dto';
import { Match } from 'models/match.model';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Historic } from 'models/historic.model';
import { UserService } from '../user/user.service';

@Injectable()
export class MatchService {
constructor(
  @InjectRepository(Match) private readonly _matchRepo: Repository<Match>,
  @InjectRepository(Historic) private readonly _historyRepo: Repository<Historic>,
  private readonly _userService: UserService
) {}


  async create(createMatchDto: CreateMatchDto, userId: number) {
    const user = await this._userService.findOne(userId)

    if(!user)
        throw new BadRequestException("User doesn't exist")

    
    const newMatch = this._matchRepo.create({ user })
    const createdMatch = await this._matchRepo.save(newMatch)
    console.log("2 ", createdMatch)
    // createdMatch.user = user
    console.log("3 ", createdMatch)
    
    console.log(createdMatch)
    const newHistoric = await this._historyRepo.save({ user, match: createdMatch })
    
    createdMatch.historic = { ...newHistoric }

    return createdMatch
  }

  findAll() {
    return `This action returns all match`;
  }

  findOne(id: number) {
    return `This action returns a #${id} match`;
  }

  update(id: number, updateMatchDto: UpdateMatchDto) {
    return `This action updates a #${id} match`;
  }

  remove(id: number) {
    return `This action removes a #${id} match`;
  }
}
