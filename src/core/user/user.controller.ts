import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  Query
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import {ApiBearerAuth, ApiQuery} from '@nestjs/swagger';
import { AuthReq } from 'types/requestTypes';
import {Roles} from "../../../decorators/roles.decorator";
import {RolesGuard} from "../auth/guards/roles.guard";
import {plainToInstance} from "class-transformer";
import {GetUserDto} from "./dto/get-user.dto";



@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}


  @Delete("/clean")
  async cleanHistoricAndMatches(@Request() req) {
    return await this.userService.cleanHistoric(+req.user.id)
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.userService.findAll();
  }


  @Get("/me")
  getTokenUser(@Request() req: AuthReq) {
    return this.userService.findOne(+req.user.id)
  }


  @Roles("adm")
  @ApiQuery({ name: 'page', required: false, type: Number, example: 0 })
  @Get('/paged')
  getUserForAdm(@Request() req: AuthReq, @Query("page") page: number = 0) {
    const users = this.userService.getUserForAdm(+req.user.id, page)
    return plainToInstance(GetUserDto, users)

  }


  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }


  @Patch('/unrestricted/:id')
  unrestrictedUpdate(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.unrestrictedUpdate(+id, updateUserDto);
  }


  @Patch(':id')
  @Roles('adm')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }


  @Roles('adm')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id)
  }
}
