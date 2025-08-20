import { QuestionsLevel1 } from "../../data/questions1";
import { QuestionsLevel2 } from "../../data/questions2";
import { QuestionsLevel3 } from "../../data/questions3";
import { Question } from "../../models/question.model";
import {  Repository } from "typeorm";


export const SeedQuestions = async (questionRepository: Repository<Question>) => {
    const questionsCount = await questionRepository.count()
    if (questionsCount > QuestionsLevel1.length + QuestionsLevel2.length + QuestionsLevel3.length) {
        console.log(`[ SEED ] Total pre-seed: ${questionsCount}`)
        console.log(`[ SEED ] Expected min: ${QuestionsLevel2.length + QuestionsLevel1.length + QuestionsLevel3.length}`)
        return 0
    }

    //se tem o ultimo, deve ter feito tudo
    // const hasLastQuestionLevel3 = await questionRepository.findOneBy({ label: QuestionsLevel3[QuestionsLevel3.length - 1].label })
    // if (hasLastQuestionLevel3) {
    //     console.log("[ SEED ] Has Last of Level 3, dont seeding")
    //     return 0
    // }

    //seeding real
    //Just to reduce time at tests
    let ql1 = [...QuestionsLevel1]
    let ql2 = [...QuestionsLevel2]
    let ql3 = [...QuestionsLevel3]
    if(process.env.NODE_ENV == "test") {
        // takes only 25%
        ql1 = ql1.slice(Math.ceil(ql1.length * 0.75))
        ql2 = ql2.slice(Math.ceil(ql2.length * 0.75))
        ql3 = ql3.slice(Math.ceil(ql3.length * 0.75))
    }
    const allQuestions = [...ql1, ...ql2, ...ql3]
    // const allQuestions = [...QuestionsLevel1, ...QuestionsLevel2, ...QuestionsLevel3]


    let affected = 0
    let wrongCount = 0

    for(let question of allQuestions) {
        try {
            await questionRepository.save(question)
            affected += 1
        } catch(e) {
            if(process.env.NODE_ENV == "test")
                wrongCount += 1
            else
                console.log("[ SEED ] ❌ Label -> " + question.label)
        }
    }

    if(wrongCount)
        console.log(`[ SEED ] Fail questions count: ${wrongCount}`)

    return affected
}

/*
Errado:
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
*/
