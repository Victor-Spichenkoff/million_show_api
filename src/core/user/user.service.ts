import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository} from 'typeorm';
import { User } from '../../../models/user.model';
import { hashPassword } from 'helpers/crypto';
import { HistoricService } from '../historic/historic.service'
import { Match } from 'models/match.model';

import {pageSize} from "../../../global";
import * as bcrypt from "bcrypt";
import * as process from "node:process";

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User) private readonly userRepo: Repository<User>,
        @InjectRepository(Match) private readonly _matchRepo: Repository<Match>,
        private readonly historicService: HistoricService,
    ) {}


    async getUserForAdm(userId: number, page: number = 0): Promise<User[]> {
        return await this.userRepo.find({
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
        return 'This action adds a new user.ts';
    }

    findAll() {
        return this.userRepo.find();
    }

    async findOne(id: number, includeMatch = false) {
        return this.userRepo.findOne({
            where: { id },
            relations: {
                historic: true, matchs: includeMatch
            },
        })
    }

    async update(id: number, updateUserDto: UpdateUserDto) {
        await this.validateUpdateUser(id, updateUserDto)

        if(updateUserDto.newPassword)
            updateUserDto.password = await hashPassword(updateUserDto.newPassword)


        // return await this.userRepo.update(id, updateUserDto)
        return "good!"
    }


    async unrestrictedUpdate(id: number, updateUserDto: UpdateUserDto) {
        if(process.env.ENV !== 'development')
            throw new BadRequestException("It's locked")

        if(updateUserDto.password)
            updateUserDto.password = await hashPassword(updateUserDto.password)

        if(updateUserDto.newPassword)
            updateUserDto.password = await hashPassword(updateUserDto.newPassword)

        return "created!"//todo: uncomment
        // return await this.userRepo.update(id, updateUserDto)
    }


    async remove(id: number) {
        const res = await this.userRepo.delete(id)
        if(res.affected)
            return `Removed user with ID ${id}`

        return `Can't remove user with ID ${id}`
    }


    async finUserByUserName(userName: string) {
        return await this.userRepo.findOne({ where: { userName } })
    }


    async validateUpdateUser(id: number, user: UpdateUserDto) {
        const dbUser = await this.findOne(id)
        if(!dbUser)
            throw new BadRequestException("User does not exist!")


        if(user.newPassword) {
            if(!user.currentPassword)
                throw new BadRequestException("Inform your current password!")
            if(user.currentPassword === user.newPassword)
                throw new BadRequestException("Current password and new password must be different!")

            if (!(await bcrypt.compare(user.currentPassword, dbUser.password)))
                throw new BadRequestException('Invalid current password')
        }
    }
}
