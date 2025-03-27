import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { dbConfig } from '../../config/dbConfig';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ControllersModule } from './controllers.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, expandVariables: true }),
    TypeOrmModule.forRoot(dbConfig),
    ControllersModule
  ],
})
export class ConfigModules {}
