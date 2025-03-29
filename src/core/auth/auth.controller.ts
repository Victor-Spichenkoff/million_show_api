import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/signin.dto';
import { SignupDto } from './dto/signup.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    // criar
    @Post("/signup")
    create(@Body() createAuthDto: SignupDto) {
        return this.authService.create(createAuthDto);
    }

    //logar
    @Post('/signin')
    async update(@Body() body: SignInDto) {
        const user = await this.authService.validateUser(body.userName, body.password);
        return this.authService.login(user);
    }
}
