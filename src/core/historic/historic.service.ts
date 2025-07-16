import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateHistoricDto } from './dto/create-historic.dto';
import { UpdateHistoricDto } from './dto/update-historic.dto';
import { Historic } from 'models/historic.model';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HomeInfos } from 'types/home';
import {Point} from "../../../models/points.model";
import {not} from "rxjs/internal/util/not";
import {HistoricQuestion} from "../../../models/historicQuestion.model";
import {Question} from "../../../models/question.model";
import {Match} from "../../../models/match.model";

@Injectable()
export class HistoricService {
  constructor(
    @InjectRepository(Historic) private readonly _historicRepo: Repository<Historic>,
    @InjectRepository(Point) private readonly _pointsRepo: Repository<Point>
  ) { }


  async getCurrentQuestion(historicId: number): Promise<Question> {
    const currentHistoric = await this._historicRepo.findOne({
      where: { id: historicId},
      relations: ['historicQuestions', 'historicQuestions.question'],
      order: { historicQuestions: { orderIndex: 'ASC' } },
    })

    if(!currentHistoric)
      throw new BadRequestException("There's no question in history")


    return currentHistoric.historicQuestions[currentHistoric?.historicQuestions.length - 1].question
  }


  async getCurrentQuestionByUserId(userId: number): Promise<Question> {
    const currentHistoric = await this._historicRepo.findOne({
      where: { user: {id:  userId }, match: { state: "playing" }},
      relations: ['historicQuestions', 'historicQuestions.question'],
      order: { historicQuestions: { orderIndex: 'ASC' } },
    })

    if(!currentHistoric)
      throw new BadRequestException("There's no question in history")


    return currentHistoric.historicQuestions[currentHistoric?.historicQuestions.length - 1].question
  }


  async getHomeInfos(userId: number): Promise<HomeInfos> {
    const historics = await this._historicRepo.find({
      where: { user: { id: userId } },
      relations: { match: true },
      order: { finishDate: "DESC" }
    })

    if(historics.length == 0)
      return {
        points: "Not Started",
        accumulatedPrizes: "none",
        correctAnswers: "0",
        leaderBoardPosition: "Play first",
        matchId: null,
        recentHistoric: null
      }


    const rankedUsers = await this._pointsRepo
        .createQueryBuilder("point")
        .select("point.userId", "userId")
        .addSelect("SUM(point.points)", "totalPoints")
        .groupBy("point.userId")
        .orderBy("totalPoints", "DESC")
        .getRawMany()

    const leaderBoardPosition = rankedUsers.findIndex(r => r.userId === userId) + 1;

    const accumulatedPrizes = historics.map(h => h.finalPrize).reduce((total, current) => total + current)
    const match = historics.map(h => h.match)

    let correctAnswers = 0
    match.forEach(m => {
      if(m.state == "won")
        correctAnswers += m.questionIndex
      else
        correctAnswers += m.questionIndex - 1
    })


    return {
      points: rankedUsers[leaderBoardPosition-1].totalPoints,
      accumulatedPrizes,
      correctAnswers,
      leaderBoardPosition,
      matchId: historics.find(h => h.match.state == "playing")?.match.id ?? null,
      recentHistoric: historics.filter(h=> h.finalState != "playing" && h.finalState != null).slice(0, 4)
    }
  }


  async getFullHistoricByUser(userId: number): Promise<Historic[]> {
    return await this._historicRepo.find({
      where: {user: { id: userId }},
      relations: { match: true},
      order: { finishDate: "DESC" }
    })
  }


  async getLastMatch(userId: number) {
    return (await this._historicRepo.find({
      where: { user: { id: userId } },
      take: 1,
      order: { id: "DESC" },
      relations: { match: true }
    }))[0]
  }


  create(createHistoricDto: CreateHistoricDto) {
    return 'This action adds a new historic';
  }


  findAll() {
    return this._historicRepo.find({ relations: { questions: true } })
  }

  findOne(id: number) {
    return this._historicRepo.findOne({
      where: { id },
      relations: { questions: true }
    })
  }

  update(id: number, updateHistoricDto: UpdateHistoricDto) {
    return `This action updates a #${id} historic`;
  }

  remove(id: number) {
    return `This action removes a #${id} historic`;
  }

  async removeAll(historics: Historic[]) {
    for (let h of historics)
      await this._historicRepo.delete(h.id)

    return true
  }
}
