import { configDotEnvFile } from 'config/dotenv'

configDotEnvFile()

import { INestApplication } from '@nestjs/common'
import { setupTestApp } from 'src/test/test-setup'
import { DataSource } from 'typeorm'
import { seed } from 'src/seeding/run'
import * as request from 'supertest'
import { getAuthTokenTest, testAuthData } from 'src/test/services/auth'
import { matchServiceFactory } from 'src/test/services/match'
import { Question } from 'models/question.model'
import { defaultHelps } from '../../global'
import { getRandomIntInclusive } from 'helpers/numeric'

describe('Match game', () => {
    let app: INestApplication
    let server: any
    let token: string
    let matchService: ReturnType<typeof matchServiceFactory>
    let currentQuestion: Question

    beforeAll(async () => {
        const { setupApp, setupServer } = await setupTestApp()
        app = setupApp
        server = setupServer

        const dataSource = app.get(DataSource)
        await seed(dataSource)

        token = await getAuthTokenTest(server)

        matchService = matchServiceFactory(server, token)
    })
    afterAll(async () => {
        await app.close()
    })

    it('Should win game', async () => {
        await matchService.startMatch()

        let questionCount = 0
        let answerRes: any
        while (true) {
            currentQuestion = (await matchService.getNextQuestion()).body
            questionCount += 1
            answerRes = await matchService.answerQuestion(currentQuestion.answerIndex)

            if(answerRes.body.points || questionCount > 16)
                break
        }


        expect(answerRes.body.points).toBeGreaterThan(1_799)// points must be high for this case
        expect(questionCount).toBe(16)
    })

    // model below (ref1)
    // verify hint use
    // correct answer not cut
    // cut only 2 options
    it('Should give correct half hint', async () => {
        let questionCount = 0
        while (questionCount < 5) {
            await matchService.startMatch(true)
            currentQuestion = (await matchService.getNextQuestion()).body
            const hintRes = await matchService.getHalfHelp()

            expect(hintRes.body[`option${currentQuestion.answerIndex}`].toUpperCase()).not.toBe('X')

            let eliminatedCount = 0
            for (let index = 1; index < 5; index++) {
                if (hintRes.body[`option${index}`].toUpperCase() == 'X') eliminatedCount++
            }
            expect(eliminatedCount).toBe(2)

            questionCount += 1
        }
    })

    // if at least 50% percent is still correct
    it('Should give correct university student hint', async () => {
        let matchCount = 0
        let wrongCount = 0
        for (let matchCount = 0; matchCount < 50; matchCount++) {
        // while (matchCount < 50) {
            await matchService.startMatch(true)
            currentQuestion = (await matchService.getNextQuestion()).body
            const hintRes = await matchService.getUniverHelp()

            const options = Object.entries(hintRes.body)
                .filter(([k]) => k.startsWith("option"))//only takes "option{more}"


            const [bestOption] = options.reduce((max: any, curr: any) =>
                curr[1] > max[1] ? curr : max
            )

            const bestRankedIndex = parseInt(bestOption.replace("option", ""), 10)

            const answerRes = await matchService.answerQuestion(bestRankedIndex)
            if(!answerRes.body.isCorrect)
                wrongCount++

            // matchCount++
        }

        expect(wrongCount).toBeLessThan(11) // 80% must be correct
    })

    it('Should skip question', async () => {
        let questionCount = 0
        await matchService.startMatch(true)
        const firstQuestion = (await matchService.getNextQuestion()).body

        await matchService.getSkipHelp()

        currentQuestion = (await matchService.getNextQuestion()).body

        expect(currentQuestion.id).not.toBe(firstQuestion.id)
    })

    it('Should block after hinted', async () => {
        await matchService.startMatch(true)

        // try univer and then half
        const firstQuestion = (await matchService.getNextQuestion()).body
        await matchService.getUniverHelp()
        const secondHintHalf = await matchService.getHalfHelp()
        expect(secondHintHalf.body.message).toBeDefined()// error message == blocked

        await matchService.answerQuestion(firstQuestion.answerIndex)

        // try half and then univer
        await matchService.getNextQuestion()
        const realHalfHelp = await matchService.getHalfHelp()
        expect(realHalfHelp.body.id).toBeDefined()
        const secondHelp = await matchService.getUniverHelp()
        expect(secondHelp.body.message).toBeDefined()// error message == blocked
    })

    it('Should discount and block helps', async () => {
        await matchService.startMatch(true)

        const helpsCount = { ...defaultHelps }

        currentQuestion = (await matchService.getNextQuestion()).body
        while (helpsCount.halfHalf || helpsCount.skips || helpsCount.universitary) {
            const type = getRandomIntInclusive(1, 3)

            if (type == 1 && helpsCount.halfHalf) {
                helpsCount.halfHalf--
                await matchService.getHalfHelp()
            } else if (type == 2 && helpsCount.universitary) {
                helpsCount.universitary--
                await matchService.getUniverHelp()
            } else if (type == 3 && helpsCount.skips) {
                helpsCount.skips--
                await matchService.getSkipHelp()
            } else {
                continue
            }

            await matchService.answerQuestion(currentQuestion.answerIndex) //reset
            currentQuestion = (await matchService.getNextQuestion()).body
        }

        expect(helpsCount.halfHalf).toBe(0)
        expect(helpsCount.universitary).toBe(0)
        expect(helpsCount.skips).toBe(0)

        // test blocks by run out
        const lastHalfTry = await matchService.getHalfHelp()
        const lastUniverTry = await matchService.getUniverHelp()
        const lastSkipTry = await matchService.getSkipHelp()

        expect(lastHalfTry.body.message.toUpperCase()).toContain("DON'T HAVE MORE")
        expect(lastUniverTry.body.message.toUpperCase()).toContain("DON'T HAVE MORE")
        expect(lastSkipTry.body.message.toUpperCase()).toContain("DON'T HAVE MORE")
    })
})

// ref1
// {
//   "id": 158,
//   "isBr": false,
//   "label": "What do we use to eat soup?",
//   "option1": "X",
//   "option2": "Knife",
//   "option3": "Spoon",
//   "option4": "X",
//   "level": 1
// }
