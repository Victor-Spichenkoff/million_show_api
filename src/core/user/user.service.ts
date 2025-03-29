import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../../models/user.model';
import { hashPassword } from 'helpers/crypto';

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private readonly _ur: Repository<User>) { }


  
  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

  findAll() {
    return this._ur.find();
  }

  findOne(id: number) {
    return this._ur.findOneBy({ id })
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    if (updateUserDto.password)
      updateUserDto.password = await hashPassword(updateUserDto.password)
    
    return await this._ur.update(id, updateUserDto)
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  async finUserByUserName(userName: string) {
    return await this._ur.findOne({ where: { userName } })
  }
}
