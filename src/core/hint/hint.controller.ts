import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { HintService } from './hint.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetQuestionDto } from '../match/dto/getQuestion.dto';
import { plainToInstance } from 'class-transformer';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('hint')
export class HintController {
  constructor(private readonly hintService: HintService) {}

  @Get("/skip")
  async skipQuestion(@Request() req) {
    return await this.hintService.skip(+req.user.id)
  }

  @Get("/universitary") 
  async getUniversitaryHelp(@Request() req){
    return await this.hintService.universitary(+req.user.id)
  }
  @Get("/half") 
  async getHalfQuestion(@Request() req){
    const question = await this.hintService.halfHalf(+req.user.id)
    return  plainToInstance(GetQuestionDto, question)
  }
}
