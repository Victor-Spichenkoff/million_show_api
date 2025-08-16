import { Controller, Get, Post, Body, Patch, Param, Delete, Request, UseGuards } from '@nestjs/common';
import { HistoricService } from './historic.service';
import { CreateHistoricDto } from './dto/create-historic.dto';
import { UpdateHistoricDto } from './dto/update-historic.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('historic')
export class HistoricController {
  constructor(private readonly historicService: HistoricService) {}

  // @Post()
  // create(@Body() createHistoricDto: CreateHistoricDto) {
  //   return this.historicService.create(createHistoricDto);
  // }

  /**
   * Infos about recent matchs from user.ts
   */
  @Get("/home")
  async getHomeInfos(@Request() req) {
    return await this.historicService.getHomeInfos(+req.user.id)
  }

  @Get("/last")
  async getLastMatchData(@Request() req) {
    return await this.historicService.getLastMatch(+req.user.id)
  }

  @Get("/full")
  async getFullHistoric(@Request() req) {
     return await this.historicService.getFullHistoricByUser(+req.user.id)
  }

  @Get("/full/:userId")
  async getFullHistoricByUser(@Param("userId") userId: string) {
    return await this.historicService.getFullHistoricByUser(+userId)
    // return await this.historicService.getFullHistoricByUserId(+userId)
  }

  @Get()
  findAll() {
    return this.historicService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.historicService.findOne(+id);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateHistoricDto: UpdateHistoricDto) {
  //   return this.historicService.update(+id, updateHistoricDto);
  // }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.historicService.remove(+id);
  }
}
