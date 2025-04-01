import { Module } from '@nestjs/common';
import { HistoricService } from './historic.service';
import { HistoricController } from './historic.controller';

@Module({
  controllers: [HistoricController],
  providers: [HistoricService],
})
export class HistoricModule {}
