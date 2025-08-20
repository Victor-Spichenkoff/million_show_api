import {INestApplication} from "@nestjs/common"
import * as request from 'supertest'
import {testAuthData} from "./services/auth"
import {setupTestApp} from "src/test/test-setup";


describe('Auth & Token', () => {
    let app: INestApplication
    let server: any
    let token: string
    let userId: string

    beforeAll(async () => {
        const {setupApp, setupServer  } = await setupTestApp()
        app = setupApp
        server = setupServer
    })

    afterAll(async () => {
        await app.close()
    })


    // create
    it('POST /auth/signup → should create user', async () => {
        const res = await request(server)
            .post('/auth/signup')
            .send({userName: testAuthData.userName, password: testAuthData.password})
            .expect(201)

        userId = res.body.id
        expect(userId).toBeDefined()
    })

    // login + token
    it("POST /auth/signin → should login", async () => {
        const res = await request(server)
            .post('/auth/signin')
            .send({userName: testAuthData.userName, password: testAuthData.password})
            .expect(201)

        token = res.body.access_token

        expect(token).toBeDefined()
    })


    // it("POST /auth/test/login → should access private route", async () => {
    //     const res = await request(server)
    //         .get('/auth/test/login')
    //         .set("Authorization", "Bearer " + token)
    //         .expect(200)
    //
    //     expect(res.body).toBeDefined()
    // })
    //
    // it("POST /auth/test/adm → should fail access private route", async () => {
    //     const res = await request(server)
    //         .get('/auth/test/adm')
    //         .set("Authorization", "Bearer " + token + "23")
    //         .expect(401)
    //
    //     expect(res.body.message).toBeDefined()
    // })
    //
    // it("POST /auth/test/adm → should fail access admin only", async () => {
    //     const res = await request(server)
    //         .get('/auth/test/adm')
    //         .set("Authorization", "Bearer " + token)
    //         .expect(403)
    //
    //     expect(res.body.message).toBeDefined()
    // })

    it("POST /auth/test/login → should access private routes", async () => {
        const res = await request(server)
            .get('/auth/test/login')
            .set("Authorization", "Bearer " + token)
            .expect(200)


        expect(res.body).toBeDefined()
    })
})
