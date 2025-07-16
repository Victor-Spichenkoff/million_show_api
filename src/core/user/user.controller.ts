import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, BadRequestException } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthReq } from 'types/requestTypes';
import {Roles} from "../../../decorators/roles.decorator";
import {RolesGuard} from "../auth/guards/roles.guard";



@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}


  @Delete("/clean")
  async cleanHistoricAndMatchs(@Request() req) {
    return await this.userService.cleanHistoric(+req.user.id)
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.userService.findAll();
  }

  // @UseGuards(JwtAuthGuard)
  @Get("/me")
  getTokenUser(@Request() req: AuthReq) {
    return this.userService.findOne(+req.user.id)
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Patch(':id')
  @Roles('adm')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Roles('adm')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
