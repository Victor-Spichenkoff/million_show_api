import { BadRequestException, Injectable } from '@nestjs/common'
import { CreateMatchDto } from './dto/create-match.dto'
import { UpdateMatchDto } from './dto/update-match.dto'
import { Match } from 'models/match.model'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Historic } from 'models/historic.model'
import { UserService } from '../user/user.service'
import { getCurrentPrizes, getLevelByQuetionIndex, giveCurrentMatchOrThrow, isAlreadyStarted } from 'helpers/matchHepers'
import { formatToCompleteNormalTime } from 'helpers/time'
import { AnswerIndex } from 'types/indexs'
import { QuestionService } from '../question/question.service'
import { AnswerReponse } from 'types/reponses'

@Injectable()
export class MatchService {
    constructor(
        @InjectRepository(Match) private readonly _matchRepo: Repository<Match>,
        @InjectRepository(Historic) private readonly _historyRepo: Repository<Historic>,
        private readonly _userService: UserService,
        private readonly _questionService: QuestionService
    ) { }


    async aswerQuestion(userId: number, answerIndex: AnswerIndex): Promise<AnswerReponse> {

        const currentMatch = await this._matchRepo.findOne({
            where: { user: { id: userId }, state: "playing" },
            relations: { historic: { questions: true } }
        })

        // const currentMatch = giveCurrentMatch(user?.matchs)
        
        if (!currentMatch)
            throw new BadRequestException("User has no active match")


        if (currentMatch.questionState == "answered")
            throw new BadRequestException("User already responded to last question. Order a new one at /match/next")



        const questions = currentMatch.historic.questions
        const lastQuestion = questions[questions.length - 1]

        //erroU ?
        if (answerIndex != lastQuestion.answerIndex) {
            currentMatch.state = 'lost'
            currentMatch.questionState = 'answered'
            
            const prizes = getCurrentPrizes(currentMatch.questionIndex)

            await this._historyRepo.update(
                { match: { id: currentMatch.id } },//where
                {
                    finalPrize: prizes.wrongPrize,
                    finishDate: Number(new Date()),
                    finalState: "lost",
                }
            )
            await this._matchRepo.save(currentMatch)
            // await this._matchRepo.update(currentMatch.id, currentMatch)

            const correctOption = lastQuestion[`option${lastQuestion.answerIndex}`]
            return {
                isCorrect: false,
                correctAnswer: correctOption,
                finalPrize: prizes.wrongPrize
            }
            // return `Wrong! \nThe answer was ${correctOption} \nYou won $${prizes.wrongPrize}`
        }

        //acertou
        currentMatch.hintState = "none"
        currentMatch.questionState = "answered"

        this._matchRepo.save(currentMatch)
        return {
            isCorrect: true,
        }
    }

    /*
    Vai apenas devolver uma nova quest random
    */
    async getNext(userId: number, isEn = false) {''
        const user = await this._userService.findOne(userId, true)

        const currentMatch = giveCurrentMatchOrThrow(user?.matchs)

        const currentHistoric = await this._historyRepo.findOneOrFail({
            where: { match: { id: currentMatch.id } },
            relations: { questions: true }
        })

        if (currentMatch.questionState == "wating" && currentHistoric.questions.length > 0)
            throw new BadRequestException("Answer the previous question first!")

        //update historic and add question
        const newlevel = getLevelByQuetionIndex(currentMatch.questionIndex)

        const userHistoric = await this._historyRepo.findBy(
            {
                user: { id: userId },
            })

        const newQuestion = await this._questionService.getNewQuestionFiltered(userHistoric, newlevel,isEn)


        if (!currentHistoric.questions)
            currentHistoric.questions = [newQuestion]
        else
            currentHistoric.questions.push(newQuestion)

        //update currentMatch
        const currentPrizes = getCurrentPrizes(currentMatch.questionIndex)
        currentMatch.nextPrize = currentPrizes.nextPrize
        currentMatch.wrongPrize = currentPrizes.wrongPrize
        currentMatch.stopPrize = currentPrizes.stopPrize
        currentMatch.questionIndex = currentHistoric.questions?.length ?? 0
        currentMatch.questionState = "wating"
        currentMatch.hintState = "none"


        this._historyRepo.save(currentHistoric)
        // this._historyRepo.update(currentHistoric.id, currentHistoric)
        this._matchRepo.update(currentMatch.id, currentMatch)

        return newQuestion
    }


    async getCurrentQuestion(userId: number) {
        const currentHistoric = await this._historyRepo.findOne({
            where: {
                user: { id: userId },
                match: { state: "playing" }
            },
            relations: { questions: true }
        })

        if (!currentHistoric?.questions || currentHistoric?.questions?.length < 1)
            throw new BadRequestException("Please get the new question at /match/next")

        return currentHistoric?.questions[currentHistoric.questions.length - 1]
    }

    async getCurrentMatch(userId) {
        const user = await this._userService.findOne(userId, true)
        return giveCurrentMatchOrThrow(user?.matchs)
    }


    async create(createMatchDto: CreateMatchDto, userId: number, force = false) {
        const user = await this._userService.findOne(userId, true)
        if (!user) throw new BadRequestException("User doesn't exist")

        // já iniciada
        const alreadyStartedMatch = isAlreadyStarted(user.matchs)
        if (alreadyStartedMatch && !force) {
            const time = formatToCompleteNormalTime((new Date(alreadyStartedMatch[0].startDate)))
            throw new BadRequestException("You have already started a match at " + time + ". Please use /match/start?force=true")
        } else if (alreadyStartedMatch && force)
            this.setManyToCancelled(alreadyStartedMatch)


        const newMatch = new Match()
        newMatch.user = user

        const createdMatch = await this._matchRepo.save(newMatch)

        const newHistoric = new Historic()
        newHistoric.user = user
        newHistoric.match = createdMatch

        await this._historyRepo.save(newHistoric)

        const finalMatch = await this._matchRepo.findOne({
            where: { id: createdMatch.id },
            relations: { historic: true },
            // relations: ["historic"],
        })


        return finalMatch
    }

    findAll() {
        return this._matchRepo.find({
            relations: {
                historic: true,
                user: true
            }
        })
    }

    async findOne(id: number) {
        return await this._matchRepo.findOneBy({ id })
    }

    update(id: number, updateMatchDto: UpdateMatchDto) {
        return `This action updates a #${id} match`
    }

    async remove(id: number) {
        return this._matchRepo.delete(id)
    }

    async removeByUser(userId: number) {
        await this._matchRepo.delete({
            user: { id: userId }
        })
    }

    async setManyToCancelled(matchs: Match[]) {
        for (let match of matchs) {
            match.state = "cancelled"
            await this._matchRepo.update(match.id, match)
        }
    }
}
