import { BadRequestException, Injectable } from '@nestjs/common';
import { SignInDto } from './dto/signin.dto';
import { SignupDto } from './dto/signup.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../../models/user.model'
import { hashPassword } from '../../../helpers/crypto'

@Injectable()
export class AuthService {
  constructor(@InjectRepository(User) private readonly _ur: Repository<User>) { }

  async create(createAuthDto: SignupDto) {
    if (!createAuthDto.password) throw new BadRequestException("Inform a password")

    if (createAuthDto.password.length < 4) throw new BadRequestException("Passwrod must have at least 4 characteres")

    createAuthDto.password = await hashPassword(createAuthDto.password)

    try {
      const finalUser = await this._ur.save(createAuthDto)
      return finalUser.userName
    } catch(e) {
      console.log(e)
      throw new BadRequestException(`User with name "${createAuthDto.userName}" already exists`)
    }
  }

  async findAll() {
    return await this._ur.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthDto: SignInDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
}
