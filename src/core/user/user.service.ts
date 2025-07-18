import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import {Not, Repository} from 'typeorm';
import { User } from '../../../models/user.model';
import { hashPassword } from 'helpers/crypto';
import { HistoricService } from '../historic/historic.service'
import { Match } from 'models/match.model';
import {not} from "rxjs/internal/util/not";
import {pageSize} from "../../../global";

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User) private readonly userRepo: Repository<User>,
        @InjectRepository(Match) private readonly _matchRepo: Repository<Match>,
        private readonly historicService: HistoricService,
    ) {}


    async getUserForAdm(userId: number, page: number = 0): Promise<User[]> {
        return await this.userRepo.find({
            where: {id: Not(userId)},
            skip: page * pageSize,
            take: pageSize,
        })
    }


    async cleanHistoric(userId: number) {
        const user = await this.userRepo.findOne({
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
        return this.userRepo.find();
    }

    findOne(id: number, includeMatch = false) {
        return this.userRepo.findOne({
            where: { id },
            relations: {
                historic: true, matchs: includeMatch
            },
        })
    }

    async update(id: number, updateUserDto: UpdateUserDto) {
        if (updateUserDto.password)
            updateUserDto.password = await hashPassword(updateUserDto.password)


        return await this.userRepo.update(id, updateUserDto)
    }

    remove(id: number) {
        return this.userRepo.delete(id)
    }

    async finUserByUserName(userName: string) {
        return await this.userRepo.findOne({ where: { userName } })
    }
}
