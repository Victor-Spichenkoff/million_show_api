import { Module } from '@nestjs/common';
import { QuestionService } from './question.service';
import { QuestionController } from './question.controller';
import { Question } from 'models/question.model';
import { TypeOrmModule } from '@nestjs/typeorm';
import {HistoricQuestion} from "../../../models/historicQuestion.model";

@Module({
  imports: [
    TypeOrmModule.forFeature([Question, HistoricQuestion]),
  ],
  controllers: [QuestionController],
  providers: [QuestionService],
  exports: [QuestionService]
})
export class QuestionModule { }
