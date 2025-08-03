import { Injectable } from '@nestjs/common';
import { UpdatePointDto } from './dto/update-point.dto';
import { Match } from '../../../models/match.model';
import { Repository } from 'typeorm';
import { Point } from '../../../models/points.model';
import { InjectRepository } from '@nestjs/typeorm';
import { getPointsInfo } from '../../../helpers/points';
import { User } from '../../../models/user.model';

@Injectable()
export class PointsService {
  constructor(
    @InjectRepository(Point) private readonly pointRepo: Repository<Point>,
  ) {}

  /*
   * Give an final state match only. Just a second to be localStorage
   * */
  async savePointsToPlayer(playerId: number, match: Match, finalPrize: number) {
    const point = new Point();
    //pegar pontos
    const pointInfo = getPointsInfo(match, finalPrize);
    point.points = pointInfo.points;
    point.totalTime = pointInfo.duration;
    //dicas
    point.skipsUsed = 2 - match.skips;
    point.univerUsed = 2 - match.universitary;
    point.halfUsed = 1 - match.halfHalf;

    point.corrects =
      match.questionState == 'answered'
        ? match.questionIndex
        : Math.max(match.questionIndex - 1, 0)

    const user = new User();
    user.id = playerId;
    point.user = user;
    await this.pointRepo.save(point);

    return point;
  }

  async getLeaderBoardByPoints(page: number = 0, take: number = 10) {
    const query = this.pointRepo.createQueryBuilder("entity")


    return await query
        .innerJoin("entity.user", "user")
        .select("user.id", "userId")
        .addSelect("user.username", "username")
        .addSelect("MAX(entity.corrects)", "bestMatchCorrects")
        .addSelect("SUM(entity.points)", "totalPoints")
        .addSelect("SUM(entity.corrects)", "totalCorrects")
        .addSelect("SUM(entity.skipsUsed + entity.univerUsed + entity.halfUsed)", "totalUsedHelps")
        .addSelect("AVG(entity.totalTime)", "avgTotalTime")
        .groupBy("user.id")
        .orderBy("totalPoints", "DESC")
        .skip(page * take)
        .take(take)
        .getRawMany();
  }

  findOne(id: number) {
    return `This action returns a #${id} point`;
  }

  update(id: number, updatePointDto: UpdatePointDto) {
    return `This action updates a #${id} point`;
  }

  remove(id: number) {
    return this.pointRepo.delete(id)
  }
}
