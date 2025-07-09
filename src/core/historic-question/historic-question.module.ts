import { Module } from '@nestjs/common';
import { HistoricQuestionService } from './historic-question.service';
import { HistoricQuestionController } from './historic-question.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {HistoricQuestion} from "../../../models/historicQuestion.model";

@Module({
  imports: [
    TypeOrmModule.forFeature([HistoricQuestion]),
  ],
  controllers: [HistoricQuestionController],
  providers: [HistoricQuestionService],
  exports: [HistoricQuestionService]
})
export class HistoricQuestionModule {}
