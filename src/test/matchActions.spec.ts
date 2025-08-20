import { configDotEnvFile } from 'config/dotenv'

configDotEnvFile()

import { INestApplication } from '@nestjs/common'
import { setupTestApp } from 'src/test/test-setup'
import * as request from 'supertest'
import {testAuthData} from "src/test/services/auth";
import {seed} from "src/seeding/run";
import {DataSource} from "typeorm";
import {Question} from "models/question.model";
import {matchServiceFactory, startMatch} from "src/test/services/match";

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
        await  seed(dataSource)

        //create
        await request(server)
            .post('/auth/signup')
            .send({userName: testAuthData.userName, password: testAuthData.password})

        const loginRes = await request(server)
            .post('/auth/signin')
            .send({userName: testAuthData.userName, password: testAuthData.password})
            .expect(201)

        token = loginRes.body.access_token

        matchService = matchServiceFactory(server, token);
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
    it('POST /match/start → should get next', async () => {
        const res = await matchService.getNextQuestion()
        // const res = await getNextQuestion(server, token)

        currentQuestion = res.body

        expect(res.body).toBeDefined()
    })

    it('POST /match/start → should answer right', async () => {
        console.log(currentQuestion)

        const res = await matchService.answerQuestion(currentQuestion.answerIndex)
        // const res = await answerQuestion(server, token, )

        console.log("BODYU>")
        console.log(res.body)
        expect(res.body.isCorrect).toBeTruthy()
    })
})
