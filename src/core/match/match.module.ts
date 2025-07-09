import { Module } from '@nestjs/common';
import { MatchService } from './match.service';
import { MatchController } from './match.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Historic } from 'models/historic.model';
import { Match } from 'models/match.model';
import { UserModule } from '../user/user.module';
import { QuestionModule } from '../question/question.module';
import { HelpersModule } from 'src/helpers/helpers.module';
import { PointsModule } from '../points/points.module';
import {HistoricQuestion} from "../../../models/historicQuestion.model";
import {HistoricModule} from "../historic/historic.module";
import {HistoricQuestionModule} from "../historic-question/historic-question.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([Match, Historic, HistoricQuestion]),
    UserModule,
    QuestionModule,
    HelpersModule,
    PointsModule,
    HistoricModule,
    HistoricQuestionModule
  ],
  controllers: [MatchController],
  providers: [MatchService],
})
export class MatchModule {}
