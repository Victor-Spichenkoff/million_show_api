import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateMatchDto } from './dto/create-match.dto';
import { UpdateMatchDto } from './dto/update-match.dto';
import { Match } from 'models/match.model';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Historic } from 'models/historic.model';
import { UserService } from '../user/user.service';
import { User } from 'models/user.model';

@Injectable()
export class MatchService {
  constructor(
    @InjectRepository(Match) private readonly _matchRepo: Repository<Match>,
    @InjectRepository(Historic) private readonly _historyRepo: Repository<Historic>,
    private readonly _userService: UserService
  ) { }

  async create(createMatchDto: CreateMatchDto, userId: number) {
    const user = await this._userService.findOne(userId);
    if (!user) throw new BadRequestException("User doesn't exist");

    const newMatch = new Match();
    newMatch.user = user;

    // 🔹 Salva `Match` primeiro
    const createdMatch = await this._matchRepo.save(newMatch);
    

    // inseria o que precisa para ele
    const newHistoric = new Historic();
    newHistoric.user = user;
    newHistoric.match = createdMatch;


    const savedHistoric = await this._historyRepo.save(newHistoric)
    

    // 🔹 Busca `Match` atualizado com `historic`
    const finalMatch = await this._matchRepo.findOne({
      where: { id: createdMatch.id },
      relations: { historic: true },
      // relations: ["historic"],
    });
    

    return finalMatch;
  }

  // async create(createMatchDto: CreateMatchDto, userId: number) {
  //   const user = await this._userService.findOne(userId)

  //   if (!user)
  //     throw new BadRequestException("User doesn't exist")


  //   const newMatch = new Match()
  //   newMatch.user = user

  //   console.log("1")
  //   const createdMatch = await this._matchRepo.save(newMatch)
  //   // createdMatch.user = user
  //   console.log("2")

  //   const newHistoric = new Historic()
  //   newHistoric.user = user
  //   newHistoric.match = createdMatch

  //   await this._historyRepo.save(newHistoric)
  //   console.log("3")


  //   createdMatch.historic = { ...newHistoric }

  //   // precisa atualizar com as novas?
  //   await this._matchRepo.update(createdMatch.id, createdMatch)
  //   console.log("4")

  //   return createdMatch
  // }



  findAll() {
    return this._matchRepo.find({
      relations: {
        historic: true,
        user: true
      }
    })
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

  async removeByUser(userId: number) {
    await this._matchRepo.delete({
      user: { id: userId }
     })
  }
}
