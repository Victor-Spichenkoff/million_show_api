import { Module } from '@nestjs/common'
import { ConfigModules } from './modules/config.module';
import { UserModule } from './core/user/user.module';
import { AuthModule } from './core/auth/auth.module';
import { ControllersModule } from './modules/controllers.module';
import { SeedingModule } from './seeding/seeding.module';
import { QuestionModule } from './core/question/question.module';
import { MatchModule } from './core/match/match.module';
import { HistoricModule } from './core/historic/historic.module';

@Module({
  imports: [ConfigModules, ControllersModule, SeedingModule, QuestionModule, MatchModule, HistoricModule],
})
export class AppModule {}
