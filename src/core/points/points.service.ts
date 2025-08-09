import { BadRequestException, Injectable } from '@nestjs/common'
import { UpdatePointDto } from './dto/update-point.dto'
import { Match } from '../../../models/match.model'
import { Repository } from 'typeorm'
import { Point } from '../../../models/points.model'
import { InjectRepository } from '@nestjs/typeorm'
import { getPointsInfo } from '../../../helpers/points'
import { User } from '../../../models/user.model'
import { UserService } from '../user/user.service'

@Injectable()
export class PointsService {
    constructor(
        @InjectRepository(Point) private readonly pointRepo: Repository<Point>,
        private readonly userService: UserService,
    ) {}

    /*
     * Give an final state match only. Just a second to be localStorage
     * */
    async savePointsToPlayer(playerId: number, match: Match, finalPrize: number) {
        const point = new Point()
        //pegar pontos
        const pointInfo = getPointsInfo(match, finalPrize)
        point.points = pointInfo.points
        point.totalTime = pointInfo.duration
        //dicas
        point.skipsUsed = 2 - match.skips
        point.univerUsed = 2 - match.universitary
        point.halfUsed = 1 - match.halfHalf

        point.corrects =
            match.questionState == 'answered'
                ? match.questionIndex
                : Math.max(match.questionIndex - 1, 0)

        const user = new User()
        user.id = playerId
        point.user = user
        await this.pointRepo.save(point)

        return point
    }

    async getLeaderBoardByPoints(page: number = 0, take: number = 10) {
        const query = this.pointRepo.createQueryBuilder('entity')

        // return await query
        //     .innerJoin('entity.user', 'user')
        //     .select('user.id', 'userId')
        //     .addSelect('user.username', 'username')
        //     .addSelect('MAX(entity.corrects)', 'bestMatchCorrects')
        //     .addSelect('SUM(entity.points)', 'totalPoints')
        //     .addSelect('SUM(entity.corrects)', 'totalCorrects')
        //     .addSelect(
        //         'SUM(entity.skipsUsed + entity.univerUsed + entity.halfUsed)',
        //         'totalUsedHelps',
        //     )
        //     .addSelect('AVG(entity.totalTime)', 'avgTotalTime')
        //     .groupBy('user.id')
        //     .orderBy('totalPoints', 'DESC')
        //     .skip(page * take)
        //     .take(take)
        //     .getRawMany()

        const pointsInfo = await query
            .select('entity.userId', 'userId')
            .addSelect('MAX(entity.corrects)', 'bestMatchCorrects')
            .addSelect('SUM(entity.points)', 'totalPoints')
            .addSelect('SUM(entity.corrects)', 'totalCorrects')
            .addSelect(
                'SUM(entity.skipsUsed + entity.univerUsed + entity.halfUsed)',
                'totalUsedHelps',
            )
            .addSelect('AVG(entity.totalTime)', 'avgTotalTime')
            .groupBy('entity.userId')
            .orderBy('totalPoints', 'DESC')
            .skip(page * take)
            .take(take)
            .getRawMany()

        let final: any[] = []
        for (let pi of pointsInfo) {
            const user = await this.userService.findOne(pi.userId)
            final.push({ ...pi, userName: user?.userName })
        }
        return final
    }

    async getPointsInfoForPlayer(playerId: number) {
        if (!playerId) throw new BadRequestException('No such ID')

        const query = this.pointRepo.createQueryBuilder('entity')

        const dbResponse = await query
            .innerJoin('entity.user', 'user')
            .where('user.id = :playerId', { playerId })
            .select('SUM(entity.points)', 'totalPoints')
            .addSelect('user.id', 'userId')
            .addSelect('user.username', 'userName')
            .addSelect('MAX(entity.points)', 'bestMatch')
            .groupBy('user.id')
            .getRawOne()

        if (!dbResponse) throw new BadRequestException("Can't find infos")

        const rankedUsers = await this.pointRepo
            .createQueryBuilder('point')
            .select('point.userId', 'userId')
            .addSelect('SUM(point.points)', 'totalPoints')
            .groupBy('point.userId')
            .orderBy('totalPoints', 'DESC')
            .getRawMany()

        const bestMatch = await query
            .where('user.id = :playerId', { playerId })
            .orderBy('entity.points / entity.totalTime', 'DESC')
            .addOrderBy('entity.points', 'DESC')
            .select([
                'entity.points AS points',
                'entity.totalTime AS totalTime',
                '(entity.points / entity.totalTime) AS efficiency',
            ])
            .limit(1)
            .getRawOne()

        dbResponse.position = rankedUsers.findIndex((r) => r.userId === playerId) + 1
        dbResponse.bestMatchPoints = bestMatch.points
        dbResponse.bestMatchTime = bestMatch.totalTime
        return dbResponse
    }

    async getPlayerStatistics(playerId: number) {}

    findOne(id: number) {
        return `This action returns a #${id} point`
    }

    update(id: number, updatePointDto: UpdatePointDto) {
        return `This action updates a #${id} point`
    }

    remove(id: number) {
        return this.pointRepo.delete(id)
    }
}
