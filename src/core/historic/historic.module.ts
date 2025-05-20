import { Module } from '@nestjs/common';
import { HistoricService } from './historic.service';
import { HistoricController } from './historic.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Historic } from 'models/historic.model';
import {Point} from "../../../models/points.model";

@Module({
  imports: [TypeOrmModule.forFeature([Historic, Point])],
  controllers: [HistoricController],
  providers: [HistoricService],
  exports: [HistoricService]
})
export class HistoricModule {}
