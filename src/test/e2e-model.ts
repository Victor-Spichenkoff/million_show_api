import {configDotEnvFile} from "config/dotenv";
configDotEnvFile()

import {INestApplication} from "@nestjs/common"
import {setupTestApp} from "src/test/test-setup";

describe('Auth & Token', () => {
    let app: INestApplication
    let server: any
    // variables here

    beforeAll(async () => {
        const {setupApp, setupServer  } = await setupTestApp()
        app = setupApp
        server = setupServer
    })
    afterAll(async () => {
        await app.close()
    })

    it('POST / → should ', async () => {
        // const res = await request(server)
        //     .post('/auth/signup')
        //     .send({userName: testAuthData.userName, password: testAuthData.password})
        //     .expect(201)

        //res.body.id
        //expect(userId).toBeDefined()
    })

})
