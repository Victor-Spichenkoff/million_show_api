import { BadRequestException, forwardRef, Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../../models/user.model';
import { hashPassword } from 'helpers/crypto';
import { HistoricService } from '../historic/historic.service'
import { MatchService } from '../match/match.service';
import { Match } from 'models/match.model';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User) private readonly _ur: Repository<User>,
        @InjectRepository(Match) private readonly _matchRepo: Repository<Match>,
        private readonly historicService: HistoricService,
    ) {}


    async cleanHistoric(userId: number) {
        const user = await this._ur.findOne({
            where: { id: userId },
            relations: { historic: true, matchs: true }
        })

        if(!user?.historic.length)
            throw new BadRequestException("Nothing to clean!")

        await this.historicService.removeAll(user?.historic)
        await this._matchRepo.delete({
            user: { id: userId }
           })

        return "All clean!"
    }

    create(createUserDto: CreateUserDto) {
        return 'This action adds a new user';
    }

    findAll() {
        return this._ur.find();
    }

    findOne(id: number, includeMatch = false) {
        return this._ur.findOne({ where: { id }, relations: { historic: true, matchs: includeMatch } })
    }

    async update(id: number, updateUserDto: UpdateUserDto) {
        if (updateUserDto.password)
            updateUserDto.password = await hashPassword(updateUserDto.password)

        return await this._ur.update(id, updateUserDto)
    }

    remove(id: number) {
        return this._ur.delete(id)
    }

    async finUserByUserName(userName: string) {
        return await this._ur.findOne({ where: { userName } })
    }
}
