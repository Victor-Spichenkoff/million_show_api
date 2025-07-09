import { Injectable } from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {HistoricQuestion} from "../../../models/historicQuestion.model";
import {Question} from "../../../models/question.model";
import {Historic} from "../../../models/historic.model";

@Injectable()
export class HistoricQuestionService {
    constructor(
        @InjectRepository(HistoricQuestion) private readonly _historicQuestionRepo: Repository<HistoricQuestion>,
    ) { }

    async addNewQuestion(newQuestion: Question, currentHistoric: Historic) {
        const newHistoricQuestion = new HistoricQuestion()
        newHistoricQuestion.historic = currentHistoric
        newHistoricQuestion.question = newQuestion
        newHistoricQuestion.orderIndex = currentHistoric.historicQuestions?.length ?? 0

        await this._historicQuestionRepo.save(newHistoricQuestion)

        return newHistoricQuestion
    }

}
