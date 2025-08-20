import { configDotEnvFile } from 'config/dotenv'

configDotEnvFile()

import { INestApplication } from '@nestjs/common'
import { setupTestApp } from 'src/test/test-setup'
import * as request from 'supertest'
import {testAuthData} from "src/test/services/auth";
import {seed} from "src/seeding/run";
import {DataSource} from "typeorm";

describe('Match Start flow', () => {
    let app: INestApplication
    let server: any
    // variables here
    let token: any

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
    })
    afterAll(async () => {
        await app.close()
    })

    //start match
    it('POST /match/start → should start match', async () => {
        const res = await request(server)
            .post('/match/start')
            .set("Authorization", "Bearer " + token)
            .expect(201)

        expect(res.body).toBeDefined()
    })

    it('POST /match/start → should not start match', async () => {
        const res = await request(server)
            .post('/match/start')
            .set("Authorization", "Bearer " + token)
            .expect(400)

        expect(res.body).toBeDefined()
    })

    it('POST /match/start → should start new match', async () => {
        const res = await request(server)
            .post('/match/start?force=true')
            .set("Authorization", "Bearer " + token)
            .expect(201)

        expect(res.body).toBeDefined()
    })
})
