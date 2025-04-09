import { Module } from '@nestjs/common';
import { HistoricHelper } from './historicHelper.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Historic } from 'models/historic.model';

@Module({
    imports: [TypeOrmModule.forFeature([Historic])],
    providers: [HistoricHelper],
    exports: [HistoricHelper],
})
export class HelpersModule {}
