import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { HintService } from './hint.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('hint')
export class HintController {
  constructor(private readonly hintService: HintService) {}

  @Get("/skip")
  async skipQuestion(@Request() req) {
    return await this.hintService.skip(+req.user.id)
  }
}
