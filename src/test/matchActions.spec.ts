import { configDotEnvFile } from 'config/dotenv'

configDotEnvFile()

import { INestApplication } from '@nestjs/common'
import { setupTestApp } from 'src/test/test-setup'
import * as request from 'supertest'
import {getAuthTokenTest, testAuthData} from 'src/test/services/auth'
import { seed } from 'src/seeding/run'
import { DataSource } from 'typeorm'
import { Question } from 'models/question.model'
import { matchServiceFactory } from 'src/test/services/match'

describe('Match actions [lose, correct, stop]', () => {
    let app: INestApplication
    let server: any
    // variables here
    let token: any
    let matchService: ReturnType<typeof matchServiceFactory>

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

    // helpers
    let currentQuestion: Question

    //start match
    it('POST /match/start → should start match', async () => {
        const res = await matchService.startMatch()

        expect(res.body).toBeDefined()
    })

    // get question
    it('GET /match/start → should get next', async () => {
        const res = await matchService.getNextQuestion()

        currentQuestion = res.body

        expect(res.body).toBeDefined()
    })

    it('should answer right', async () => {
        const res = await matchService.answerQuestion(currentQuestion.answerIndex)

        expect(res.body.isCorrect).toBeTruthy()
    })

    it('Should answer wrong', async () => {
        // don't create cause uses the previous
        const currentQuestion = (await matchService.getNextQuestion()).body
        const res = await matchService.answerQuestion(1 == currentQuestion.answerIndex ? 3 : 1)

        expect(res.body.isCorrect).toBeFalsy()
    })


    it('Should stop match', async () => {
        // prepare
        await matchService.startMatch()
        await matchService.getNextQuestion()

        const stopRes = await matchService.stopMatch()

        const getMatchInfo = await matchService.getCurrentQuestion()

        expect(stopRes.body.finalPrize).toBeDefined()
        expect(getMatchInfo.body.message).toBeDefined()// error at get == really stopped
    })
})
