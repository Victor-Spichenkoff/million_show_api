import {Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query} from '@nestjs/common';
import { PointsService } from './points.service';
import { CreatePointDto } from './dto/create-point.dto';
import { UpdatePointDto } from './dto/update-point.dto';
import {ApiBearerAuth, ApiQuery} from "@nestjs/swagger";
import {JwtAuthGuard} from "../auth/guards/jwt-auth.guard";


@Controller('points')
export class PointsController {
  constructor(private readonly pointsService: PointsService) {}

  @ApiQuery({ name: "page", required: false, type: Number, example: null })
  @ApiQuery({ name: "take", required: false, type: Number, example: null })
  @Get("/leaderboard/points")
  create(@Query("page") page: number, @Query("take") take?: number) {
    return this.pointsService.getLeaderBoardByPoints(page, take)
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.pointsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePointDto: UpdatePointDto) {
    return this.pointsService.update(+id, updatePointDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.pointsService.remove(+id);
  }
}
