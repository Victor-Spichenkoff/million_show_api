import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Not, Repository } from 'typeorm';
import { Question } from 'models/question.model';
import { Historic } from 'models/historic.model';

@Injectable()
export class QuestionService {
    constructor(@InjectRepository(Question) private readonly _qr: Repository<Question>) { }


    async getNewQuestionFiltered(userHistoric: Historic[], level: 1 | 2 | 3, isEn: boolean) {
        const questionsIds: number[] = []//userHistoric.map(h => h.questions.map(q => q.id))

        // const isBr = !isEn

        for (let historic of userHistoric)
            if (historic.questions)
                for (let question of historic.questions)
                    questionsIds.push(question.id)

        const randomQuestion = await this._qr.createQueryBuilder("question")
            .where("question.id NOT IN (:...questionsIds)", { questionsIds })
            .andWhere("question.level = :level", { level })
            .andWhere("question.isBr != :isEn", { isEn })
            .orderBy("RANDOM()")
            .getOne()

        if(randomQuestion != null)
            return randomQuestion

        const secondTry = await this._qr.createQueryBuilder("question")
            .where("question.level = :level", { level })
            .andWhere("question.isBr != :isEn", { isEn })
            .orderBy("RANDOM()")
            .getOne()

        if(!secondTry)
            throw new InternalServerErrorException("No more new question to you! You ended the game!")

        return secondTry
    }

    async create(createQuestionDto: CreateQuestionDto) {
        return await this._qr.save(createQuestionDto)
    }

    async findPaged(page = 0, skip = 10) {
        return await this._qr.find({
            skip: page * skip,
            take: skip,
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
