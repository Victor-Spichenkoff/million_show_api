import { Module } from '@nestjs/common';
import { HintService } from './hint.service';
import { HintController } from './hint.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Question } from 'models/question.model';
import { Match } from 'models/match.model';
import { User } from 'models/user.model';

@Module({
  imports: [TypeOrmModule.forFeature([Question, Match, User])],
  controllers: [HintController],
  providers: [HintService],
})
export class HintModule {}
