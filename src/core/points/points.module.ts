import { Module } from '@nestjs/common';
import { PointsService } from './points.service';
import { PointsController } from './points.controller';
import {Point} from "../../../models/points.model";
import {TypeOrmModule} from "@nestjs/typeorm";
import {UserModule} from "../user/user.module";

@Module({
  imports: [TypeOrmModule.forFeature([Point]), UserModule],
  controllers: [PointsController],
  providers: [PointsService],
  exports: [PointsService],
})
export class PointsModule {}
