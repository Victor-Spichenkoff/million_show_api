import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { dbConfig } from '../../config/dbConfig';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ControllersModule } from './controllers.module';
import { SeedingModule } from 'src/seeding/seeding.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, expandVariables: true }),
    TypeOrmModule.forRoot(dbConfig),
    ControllersModule,
    SeedingModule
  ],
})
export class ConfigModules {}
