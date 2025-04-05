import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Query } from '@nestjs/common';
import { MatchService } from './match.service';
import { CreateMatchDto } from './dto/create-match.dto';
import { UpdateMatchDto } from './dto/update-match.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { AnswerIndex } from 'types/indexs';
import { GetQuestionDto } from './dto/getQuestion.dto';
import { plainToInstance } from 'class-transformer';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('match')
export class MatchController {
  constructor(
    private readonly matchService: MatchService,

  ) { }


  @ApiQuery({ name: "force", required: false, type: Boolean, example: "" })
  @Post("/start")
  create(
    @Body() createMatchDto: CreateMatchDto,
    @Request() req,
    @Query("force") force?: string) {
    return this.matchService.create(createMatchDto, req.user.id, force == "true")
  }


  @ApiQuery({ name: "isEn", required: false, type: Boolean, example: "" })
  @Get("/next")
  async getNextQuestion(@Request() req, @Query("isEn") isEn?: string) {
    const question = await this.matchService.getNext(+req.user.id, isEn == "true")

    return plainToInstance(GetQuestionDto, question)
  } 


  @Patch("/asnwer/:index")
  async answer(@Param("index") index: AnswerIndex, @Request() req) {
    return await this.matchService.aswerQuestion(+req.user.id, index)
  }


  /**
   * Da partida
   */
  @Get("/status")
  async getCurrentData(@Request() req) {
    return await this.matchService.getCurrentMatch(+req.user.id)
  }




  @Get("/current/question")
  async getCurrentQuestion(@Request() req) {
    const question = await this.matchService.getCurrentQuestion(+req.user.id)
    return plainToInstance(GetQuestionDto, question)
  }


  @Get()
  findAll() {
    return this.matchService.findAll();
  }


  /**
   * 100%, apaga mesmo
   */
  @Delete("/clean")
  async removeAllFromUser(@Request() req) {
    return await this.matchService.removeByUser(+req.user.id)
  }


  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.matchService.findOne(+id);
  }


  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateMatchDto: UpdateMatchDto) {
  //   return this.matchService.update(+id, updateMatchDto);
  // }

  /**
   * Individual
   */
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.matchService.remove(+id);
  }
}
