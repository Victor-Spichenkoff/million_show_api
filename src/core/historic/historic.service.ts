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

@Injectable()
export class HistoricService {
  constructor(
    @InjectRepository(Historic) private readonly _historicRepo: Repository<Historic>,
    @InjectRepository(Point) private readonly _pointsRepo: Repository<Point>
  ) { }


  async getCurrentQuestion(historicId: number): Promise<Question> {
    const currentHistoric = await this._historicRepo.findOneOrFail({
      where: { id: historicId},
      relations: ['historicQuestions', 'historicQuestions.question'],
      order: { historicQuestions: { orderIndex: 'ASC' } },
    })


    return currentHistoric.historicQuestions[currentHistoric?.historicQuestions.length - 1].question
  }


  async getHomeInfos(userId: number): Promise<HomeInfos> {
    const historic = await this._historicRepo.find({
      where: { user: { id: userId } },
      relations: { match: true }
    })

    if(historic.length == 0)
      return {
        points: "Not Started",
        accumulatedPrizes: "none",
        alreadyStarted: false,
        correctAnswers: "0",
        leaderBoardPosition: "Play first",
        matchId: null
      }

    const pointsByUser = await this._pointsRepo.find({
      where: { user: { id: userId } },
      select: { points: true },
    })

    let points: string | number = "Not Started"
    if(pointsByUser.length != 0)
      points = pointsByUser.reduce((accumulator, current) => accumulator + current.points, 0)

    //TODO: IMPLEMENT THE REST (show real infos, alreadyStarted, correctAnswers, poisition, ...)
    return {
      points,
      accumulatedPrizes: "none",
      alreadyStarted: true,
      correctAnswers: "0",
      leaderBoardPosition: "Let's get started?",
      matchId: historic.find(h => h.match.state == "playing")?.match.id ?? null
    }
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
