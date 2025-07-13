import { BadRequestException, Injectable, InternalServerErrorException, } from '@nestjs/common'
import { SignInDto } from './dto/signin.dto'
import { SignupDto } from './dto/signup.dto'
import { Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'
import { User } from '../../../models/user.model'
import { hashPassword } from '../../../helpers/crypto'
import { JwtService } from '@nestjs/jwt'
import { UserService } from '../user/user.service'
import * as bcrypt from 'bcrypt'

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User) private readonly _userRepo: Repository<User>,
        private readonly jwtService: JwtService,
        private readonly userService: UserService) { }

    async create(createAuthDto: SignupDto) {
        if (!createAuthDto.password) throw new BadRequestException("Inform a password")

        createAuthDto.password = await hashPassword(createAuthDto.password)

        try {
            const finalUser = await this._userRepo.save(createAuthDto)
            return await this.login(finalUser)
            // return finalUser.userName//don't use it, I guess
        } catch (error) {
            if (error.code === "SQLITE_CONSTRAINT" || error.code === "23505")
                throw new BadRequestException(`User with name '${createAuthDto.userName}' already exists`)

            console.log(error)
            throw new InternalServerErrorException("Something went wrong")
        }
    }

    async login(user: User) {
        const payload = { sub: user.id, userName: user.userName, role: user.role }

        return {
            ...user,
            access_token: this.jwtService.sign(payload, {
                expiresIn: process.env.NODE_ENV == "development" ? "30d" : "1d"
            }),
            expires_in: 60 * 60 * 24//frontend use it as seconds
        }
    }


    async validateUser(email: string, password: string): Promise<any> {
        const user = await this.userService.finUserByUserName(email)
        if (user && (await bcrypt.compare(password, user.password))) {
            const { password, ...result } = user
            return result
        }
        throw new BadRequestException('Invalid Username or Password')
    }
}
