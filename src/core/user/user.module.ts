import { forwardRef, Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from '../../../models/user.model';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HistoricModule } from '../historic/historic.module';
import { MatchModule } from '../match/match.module';
import { Match } from 'models/match.model';

@Module({
  imports: [TypeOrmModule.forFeature([User, Match]), HistoricModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService]
})
export class UserModule {}
