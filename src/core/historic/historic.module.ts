import { Module } from '@nestjs/common';
import { HistoricService } from './historic.service';
import { HistoricController } from './historic.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Historic } from 'models/historic.model';
import { MatchModule } from '../match/match.module';

@Module({
  imports: [TypeOrmModule.forFeature([Historic])],
  controllers: [HistoricController],
  providers: [HistoricService],
  exports: [HistoricService]
})
export class HistoricModule {}
