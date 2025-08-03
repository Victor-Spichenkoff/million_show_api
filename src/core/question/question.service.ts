import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Question } from 'models/question.model';
import {HistoricQuestion} from "../../../models/historicQuestion.model";
import {pageSize} from "../../../global";
import {Not} from "typeorm/browser";
import {startWith} from "rxjs";
import {dbConfig} from "../../../config/dbConfig";

@Injectable()
export class QuestionService {
    constructor(
        @InjectRepository(Question) private readonly _questionRepo: Repository<Question>
    ) { }


    async getNewQuestionFiltered(userHistoric: HistoricQuestion[], level: 1 | 2 | 3, isEn: boolean) {
        const questionsIds: number[] = []//userHistoric.map(h => h.questions.map(q => q.id))

        // const isBr = !isEn

        for (let hq of userHistoric)
            if (hq.question)
                questionsIds.push(hq.question.id)


        const randomQuestion = await this._questionRepo.createQueryBuilder("question")
            .where("question.id NOT IN (:...questionsIds)", { questionsIds })
            .andWhere("question.level = :level", { level })
            .andWhere("question.isBr != :isEn", { isEn })
            .orderBy("RANDOM()")
            .getOne()

        if(randomQuestion != null)
            return randomQuestion

        const secondTry = await this._questionRepo.createQueryBuilder("question")
            .where("question.level = :level", { level })
            .andWhere("question.isBr != :isEn", { isEn })
            .orderBy("RANDOM()")
            .getOne()

        if(!secondTry)
            throw new InternalServerErrorException("No more new question to you! You ended the game!")

        return secondTry
    }


    async create(createQuestionDto: CreateQuestionDto) {
        return await this._questionRepo.save(createQuestionDto)
    }


    async findPaged(page = 0, isEn: boolean, skip: number = pageSize, q) {
        if(!q)
            return await this._questionRepo.find({
                where: { isBr: !isEn },
                skip: page * skip,
                take: skip,
            })

        // With query
        const query = this._questionRepo
            .createQueryBuilder("entity")

        query.distinct(true)

        if(Number(q)) {
            query
                .orWhere("CAST(entity.id AS TEXT) LIKE :id", { id: `${q}%` })
                .take(pageSize)
                .skip(pageSize * page)
        }

        query
            .orWhere("LOWER(entity.label) LIKE :label", { label: `%${q.toLowerCase()}%` })
            .take(pageSize)
            .skip(pageSize * page)

        return await query.getMany();
    }

    async findAll() {
        return await this._questionRepo.find()
    }

    async findOne(id: number) {
        return await this._questionRepo.findOneBy({ id })
    }

    async update(id: number, updateQuestionDto: UpdateQuestionDto) {
        Object.keys(updateQuestionDto).forEach((key) => {
            //for extra spaces and line breaks
            if(typeof updateQuestionDto[key] === 'string')
                updateQuestionDto[key] = updateQuestionDto[key].replace(/\s+/g, " ").trim()

        })

        return await this._questionRepo.update(id, updateQuestionDto)
    }

    async remove(id: number) {
        return await this._questionRepo.delete(id)
    }
}
