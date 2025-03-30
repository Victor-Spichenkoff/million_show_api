import { Injectable } from '@nestjs/common';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Question } from 'models/question.model';

@Injectable()
export class QuestionService {
    constructor(@InjectRepository(Question) private readonly _qr: Repository<Question>) { }


    async create(createQuestionDto: CreateQuestionDto) {
        return await this._qr.save(createQuestionDto)
    }

    async findPaged(page = 0, skip = 10) {
        return await this._qr.find({
            skip: page * skip,
            take: skip
        })
    }

    async findAll() {
        return await this._qr.find()
    }

    async findOne(id: number) {
        return await this._qr.findOneBy({ id })
    }

    async update(id: number, updateQuestionDto: UpdateQuestionDto) {
        return await this._qr.update(id, updateQuestionDto)
    }

    async remove(id: number) {
        return await this._qr.delete(id)
    }
}
