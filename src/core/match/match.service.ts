import { BadRequestException, Injectable } from '@nestjs/common'
import { CreateMatchDto } from './dto/create-match.dto'
import { UpdateMatchDto } from './dto/update-match.dto'
import { Match } from 'models/match.model'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Historic } from 'models/historic.model'
import { UserService } from '../user/user.service'
import { getCurrentPrizes, getLevelByQuetionIndex, giveCurrentMatchOrThrow, isAlreadyStarted } from 'helpers/matchHepers'
import {formatToCompleteNormalTime, seedRandomDate} from 'helpers/time'
import { AnswerIndex } from 'types/indexs'
import { QuestionService } from '../question/question.service'
import { AnswerResponse } from 'types/reponses'
import { HistoricHelper } from 'src/helpers/historicHelper.service'
import {PointsService} from "../points/points.service";
import {HistoricQuestion} from "../../../models/historicQuestion.model";
import {HistoricService} from "../historic/historic.service";
import {HistoricQuestionService} from "../historic-question/historic-question.service";

@Injectable()
export class MatchService {
    constructor(
        @InjectRepository(Match) private readonly _matchRepo: Repository<Match>,
        @InjectRepository(Historic) private readonly _historyRepo: Repository<Historic>,
        @InjectRepository(HistoricQuestion) private readonly _historicQuestionRepo: Repository<HistoricQuestion>,
        private readonly _userService: UserService,
        private readonly _questionService: QuestionService,
        private readonly _pointsService: PointsService,
        private readonly _historicHelperService: HistoricHelper,
        private readonly _historicService: HistoricService,
        private readonly _historicQuestionService: HistoricQuestionService,
    ) {}


    async answerQuestion(userId: number, answerIndex: AnswerIndex): Promise<AnswerResponse> {
        // return {
        //     isCorrect: true,
        //     // points: 1200
        // }

        // return {
        //     isCorrect: false,
        //     correctAnswer: 2,
        //     finalPrize: 12000,
        //     points: 67
        // }

        const currentMatch = await this._matchRepo.findOne({
            where: { user: { id: userId }, state: "playing" },
            relations: { historic: { questions: true } }
        })

        if (!currentMatch)
            throw new BadRequestException("User has no active match")


        if (currentMatch?.questionState == "answered")
            throw new BadRequestException("User already responded to last question. Order a new one, please")


        const lastQuestion = await this._historicService.getCurrentQuestion(currentMatch.historic.id)

        //erroU ?
        if (answerIndex != lastQuestion.answerIndex) {
            currentMatch.state = 'lost'

            const prizes = getCurrentPrizes(currentMatch.questionIndex)

            await this._historyRepo.update(
                { match: { id: currentMatch.id } },//where
                {
                    finalPrize: prizes.wrongPrize,
                    finishDate: Number(new Date()),
                    finalState: "lost",
                }
            )
            // currentMatch.questionState = 'answered'//to the points build
            await this._matchRepo.save(currentMatch)

            const correctOption = lastQuestion.answerIndex
            // if want full text: const correctOption = lastQuestion[`option${lastQuestion.answerIndex}`]

            // save match points
            const pointInfos = await this._pointsService.savePointsToPlayer(userId, currentMatch, prizes.wrongPrize)
            return {
                isCorrect: false,
                correctAnswer: correctOption,
                finalPrize: prizes.wrongPrize,
                points: pointInfos.points
            }
        }

        //correct
        currentMatch.hintState = "none"
        currentMatch.questionState = "answered"

        // It's million prize
        if(currentMatch.questionIndex == 16) {
            currentMatch.state = "won"
            await this._matchRepo.save(currentMatch)
            const pointsInfo = await this._pointsService.savePointsToPlayer(userId, currentMatch, 1_000_000)

            return {
                isCorrect: true,
                points: pointsInfo.points,
            }
        }


        await this._matchRepo.save(currentMatch)
        return {
            isCorrect: true,
        }
    }


    async stop(userId: number) {
        const match = await  this.getCurrentMatch(userId)
        if (!match)
            throw new BadRequestException("User has no active match")

        if(match.state != "playing")
            throw new BadRequestException("You can only stop a playing match")

        const prizes = getCurrentPrizes(match.questionIndex)

        await this._matchRepo.update(match.id, { state: 'stopped' })
        const pointsInfo = await this._pointsService.savePointsToPlayer(userId, match, prizes.stopPrize)


        return {
            finalPrize: prizes.stopPrize,
            points: pointsInfo.points
        }
    }

    /*
    Vai apenas devolver uma nova quest random
    */
    async getNext(userId: number, isEn = false) {
        const user = await this._userService.findOne(userId, true)

        const currentMatch = giveCurrentMatchOrThrow(user?.matchs)

        const currentHistoric = await this._historyRepo.findOneOrFail({
            where: { match: { id: currentMatch.id } },
            relations: {questions: true, historicQuestions: true },
            order: { historicQuestions: { orderIndex: 'ASC' } },
        })

        if (currentMatch.questionState == "waiting" && currentHistoric.historicQuestions.length > 0)
            throw new BadRequestException("Answer the previous question first!")

        //update historic and add question
        const newLevel = getLevelByQuetionIndex(currentMatch.questionIndex)


        const test= await this._historicQuestionRepo.find({
            where: { historic: { user: { id: userId } } }
        })

        const newQuestion = await this._questionService.getNewQuestionFiltered(test, newLevel, isEn)

        await this._historicQuestionService.addNewQuestion(newQuestion, currentHistoric)

        currentMatch.questionIndex += 1

        //update currentMatch
        const currentPrizes = getCurrentPrizes(currentMatch.questionIndex)
        currentMatch.nextPrize = currentPrizes.nextPrize
        currentMatch.wrongPrize = currentPrizes.wrongPrize
        currentMatch.stopPrize = currentPrizes.stopPrize
        // currentMatch.questionIndex = currentHistoric.questions.length
        currentMatch.questionState = "waiting"
        currentMatch.hintState = "none"

        await this._matchRepo.update(currentMatch.id, currentMatch)

        return newQuestion
    }


    async getCurrentQuestion(userId: number) {
        const user = await this._userService.findOne(userId, true)

        const currentMatch = giveCurrentMatchOrThrow(user?.matchs)

        const currentHistoric = await this._historyRepo.findOneOrFail({
            where: { match: { id: currentMatch.id } },
            relations: {questions: true, historicQuestions: true },
            // relations: ['historicQuestions', 'historicQuestions.question'],
            order: { historicQuestions: { orderIndex: 'ASC' } },
        })


        if (!currentHistoric?.questions || currentHistoric?.historicQuestions.length < 1)
            throw new BadRequestException("Please get the new question at /match/next")

        return currentHistoric.historicQuestions[currentHistoric.historicQuestions.length - 1].question
    }

    async getCurrentMatch(userId: number) {
        const user = await this._userService.findOne(userId, true)
        return giveCurrentMatchOrThrow(user?.matchs)
    }


    async create(createMatchDto: CreateMatchDto, userId: number, force = false) {
        const user = await this._userService.findOne(userId, true)
        if (!user) throw new BadRequestException("User doesn't exist")

        // limpar historic
        await this._historicHelperService.deleteExtraHistorics(userId)

        // já iniciada
        const alreadyStartedMatch = isAlreadyStarted(user.matchs)
        if (alreadyStartedMatch && !force) {
            const time = formatToCompleteNormalTime((new Date(alreadyStartedMatch[0].startDate)))
            throw new BadRequestException("You have already started a match at " + time + ". Please use /match/start?force=true")
        } else if (alreadyStartedMatch && force)
            await this.setManyToCancelled(alreadyStartedMatch)


        const newMatch = new Match()
        newMatch.user = user
        if(process.env.IS_SEED=="true") {
            console.log("SEED DATA CHANGE")
            newMatch.startDate = seedRandomDate()
        }

        const createdMatch = await this._matchRepo.save(newMatch)

        const newHistoric = new Historic()
        newHistoric.user = user
        newHistoric.match = createdMatch

        await this._historyRepo.save(newHistoric)

        return await this._matchRepo.findOne({
            where: { id: createdMatch.id },
            relations: { historic: true },
            // relations: ["historic"],
        })
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
            await this._historyRepo.update({
                match: { id: match.id }
            }, { finishDate: Number(new Date()), finalState: "cancelled" })
            match.state = "cancelled"
            await this._matchRepo.update(match.id, match)
        }
    }
}
