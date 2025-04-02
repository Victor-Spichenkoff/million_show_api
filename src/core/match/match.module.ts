import { forwardRef, Module } from '@nestjs/common';
import { MatchService } from './match.service';
import { MatchController } from './match.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Historic } from 'models/historic.model';
import { Match } from 'models/match.model';
import { UserModule } from '../user/user.module';
import { HistoricModule } from '../historic/historic.module';
import { User } from 'models/user.model';


@Module({
  imports: [TypeOrmModule.forFeature([Match, Historic]), UserModule],
  controllers: [MatchController],
  providers: [MatchService],
})
export class MatchModule {}
