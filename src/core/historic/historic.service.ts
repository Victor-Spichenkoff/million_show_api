import { Injectable } from '@nestjs/common';
import { CreateHistoricDto } from './dto/create-historic.dto';
import { UpdateHistoricDto } from './dto/update-historic.dto';
import { Historic } from 'models/historic.model';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class HistoricService {
  constructor(
    @InjectRepository(Historic) private readonly _hr: Repository<Historic>,
  ) { }

  create(createHistoricDto: CreateHistoricDto) {
    return 'This action adds a new historic';
  }

  findAll() {
    return this._hr.find({ relations: { questions: true } })
  }

  findOne(id: number) {
    return this._hr.findOne({
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
    for(let h of historics) 
      await this._hr.delete(h.id)

    return true
  }
}
