import { Injectable } from '@nestjs/common';
import { CreateHistoricDto } from './dto/create-historic.dto';
import { UpdateHistoricDto } from './dto/update-historic.dto';

@Injectable()
export class HistoricService {
  create(createHistoricDto: CreateHistoricDto) {
    return 'This action adds a new historic';
  }

  findAll() {
    return `This action returns all historic`;
  }

  findOne(id: number) {
    return `This action returns a #${id} historic`;
  }

  update(id: number, updateHistoricDto: UpdateHistoricDto) {
    return `This action updates a #${id} historic`;
  }

  remove(id: number) {
    return `This action removes a #${id} historic`;
  }
}
