import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateHistoricDto } from './dto/create-historic.dto';
import { UpdateHistoricDto } from './dto/update-historic.dto';
import { Historic } from 'models/historic.model';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class HistoricService {
  constructor(
    @InjectRepository(Historic) private readonly _historicRepo: Repository<Historic>,
  ) { }


  async getLastMatch(userId: number) {
    return (await this._historicRepo.find({
      where: { user: { id: userId } },
      take: 1,
      order: { id: "DESC" },
      relations: { match: true }
    }))[0]
  }

  async getCurrentQuestion(userId: number) {
    const historic = await this._historicRepo.findOne({
      where: {
        user: { id: userId },
        match: { state: "playing" }
      },
      relations: { questions: true }
    })

    if (!historic || historic.questions.length == 0)
      throw new BadRequestException("User has no active match")

    return historic.questions[historic.questions.length - 1]
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
