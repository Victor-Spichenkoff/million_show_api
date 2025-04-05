import { Module } from '@nestjs/common';
import { UserModule } from '../core/user/user.module';
import { AuthModule } from '../core/auth/auth.module';
import { HintModule } from 'src/core/hint/hint.module';
import { QuestionModule } from 'src/core/question/question.module';
import { MatchModule } from 'src/core/match/match.module';
import { HistoricModule } from 'src/core/historic/historic.module';

@Module({
  imports: [
    UserModule,
    AuthModule,
    QuestionModule,
    MatchModule,
    HistoricModule,
    HintModule
  ]
})
export class ControllersModule { }
