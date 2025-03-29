import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { QuestionsLevel1 } from "data/questions1";
import { Question } from "models/question.model";
import { Repository } from "typeorm";

@Injectable()
export class SeedQuestions {
    constructor(@InjectRepository(Question) private readonly _qr: Repository<Question>) {}

    async run() {
        if(await this.isAlreadySeed())
            return false

        for(let q1 of QuestionsLevel1)
            await this._qr.save(q1)

        for(let q2 of QuestionsLevel1)
            await this._qr.save(q2)

        for(let q3 of QuestionsLevel1)
            await this._qr.save(q3)

        return true
    }

    private async isAlreadySeed() {
        const questionsCount = await this._qr.count()
        if(questionsCount > QuestionsLevel1.length * 2)
            return true

        return false
    }
}