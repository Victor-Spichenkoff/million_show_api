import {Controller, Get, Post, Body, Patch, Param, Delete, UseGuards} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/signin.dto';
import { SignupDto } from './dto/signup.dto';
import {JwtAuthGuard} from "./guards/jwt-auth.guard";
import {ApiBearerAuth} from "@nestjs/swagger";
import {Roles} from "../../../decorators/roles.decorator";
import {RolesGuard} from "./guards/roles.guard";
import {Sleep} from "helpers/time";

@ApiBearerAuth()
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }


    @UseGuards(JwtAuthGuard)
    @Get("/test/login")
    test(){
        return this.authService.testLogin()
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles("adm")
    @Get("/test/adm")
    testAdm(){
        return this.authService.testLogin()
    }

    // create
    @Post("/signup")
    create(@Body() createAuthDto: SignupDto) {
        return this.authService.create(createAuthDto);
    }

    //login
    @Post('/signin')
    async update(@Body() body: SignInDto) {
        const user = await this.authService.validateUser(body.userName, body.password);
        return await this.authService.login(user);
    }
}
